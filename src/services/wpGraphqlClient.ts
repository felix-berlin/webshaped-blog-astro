import { captureException } from "@sentry/astro";
import { Client, fetchExchange, type AnyVariables, type TypedDocumentNode } from "@urql/core";
import { WP_API } from "astro:env/client";
import { WP_AUTH_PASS, WP_AUTH_USER } from "astro:env/server";

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Shared, authenticated urql Client for server-side WPGraphQL requests.
 *
 * Sends HTTP Basic Auth with a WP core Application Password (no plugin needed).
 * WPGraphQL itself serves public queries anonymously — the credential is needed
 * because cms.webshaped.de runs behind a maintenance-mode plugin, which serves an
 * HTML holding page to logged-out clients. Verified 2026-07-31: anonymous POST
 * returns the maintenance page, authenticated POST returns data. If maintenance
 * mode is lifted, these queries keep working; the credential just stops mattering.
 *
 * No cacheExchange: this module lives for the whole process and urql's document
 * cache has no TTL, so SSR routes would freeze at their first post-boot fetch.
 * Tradeoff: no request-level dedup either — every SSR render hits WordPress.
 *
 * Not exported: every caller must go through wpQuery/wpQueryChrome to get their
 * no-data/partial-error handling — a caller reaching for the raw client would
 * silently lose that.
 */
const wpGraphqlClient = new Client({
  exchanges: [fetchExchange],
  // A function (not a static object) so a fresh AbortSignal.timeout() is created
  // per request — a shared signal would abort every request after the first timeout.
  fetchOptions: () => ({
    headers: {
      Authorization: `Basic ${Buffer.from(`${WP_AUTH_USER}:${WP_AUTH_PASS}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    // Without this, a hung cms.webshaped.de leaves the SSR request hanging
    // indefinitely instead of failing — no bound existed before this client.
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  }),
  url: WP_API,
});

/** Operation name from the document, so a failure names the query that failed. */
const operationName = (query: TypedDocumentNode<unknown, AnyVariables>): string =>
  query.definitions.find((def) => def.kind === "OperationDefinition")?.name?.value ?? "anonymous";

/**
 * Query WPGraphQL and throw when nothing usable came back.
 *
 * urql resolves rather than rejects — a 401, a schema drift or a WP 500 all arrive
 * as `result.error` with `data: undefined`. Without this guard callers optional-chain
 * past it and a successful build ships empty pages.
 *
 * `data` is checked first on purpose: urql sets `result.error` for *any* `errors`
 * entry, including the partial-success responses WPGraphQL returns with HTTP 200
 * (one unresolvable node, one restricted field). Throwing on those would drop 199
 * good posts because the 200th has a broken relation — so they are logged, not fatal.
 */
export const wpQuery = async <TData, TVariables extends AnyVariables>(
  query: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
): Promise<TData> => {
  const result = await wpGraphqlClient.query(query, variables).toPromise();
  const name = operationName(query as TypedDocumentNode<unknown, AnyVariables>);

  if (!result.data) {
    throw new Error(
      `WPGraphQL "${name}" returned no data (${JSON.stringify(variables)}): ${
        result.error?.message ?? "unknown error"
      }`,
    );
  }

  if (result.error) {
    console.error(`WPGraphQL "${name}" partial errors, rendering anyway: ${result.error.message}`);
  }

  return result.data;
};

/**
 * `wpQuery` for page chrome (menus, categories, author) rather than content.
 *
 * Returns null instead of throwing: header and footer render on every page —
 * including `404.astro` — so a WordPress hiccup would otherwise turn the site's
 * only recovery route into a 500. Content queries keep the hard throw, because an
 * empty article is worse than a failed build.
 *
 * Also reports to Sentry, not just console.error: this swallows real outages
 * (a bad WP_AUTH_PASS rotation, a WPGraphQL schema break) behind a blank nav/
 * footer on every page, with a 200 status — console output alone is invisible
 * in production unless someone happens to be tailing container logs.
 */
export const wpQueryChrome = async <TData, TVariables extends AnyVariables>(
  query: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
): Promise<null | TData> =>
  wpQuery(query, variables).catch((error: unknown) => {
    console.error(`WPGraphQL chrome query failed, rendering without it: ${String(error)}`);
    captureException(error);

    return null;
  });
