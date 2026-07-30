import { Client, fetchExchange, type AnyVariables, type TypedDocumentNode } from "@urql/core";
import { WP_API } from "astro:env/client";
import { WP_AUTH_PASS, WP_AUTH_USER } from "astro:env/server";

/**
 * Shared, authenticated urql Client for server-side WPGraphQL requests.
 * WPGraphQL requires authentication for all requests — this sends HTTP Basic Auth
 * using an Application Password (WP core, no plugin needed).
 *
 * No cacheExchange: this module lives for the whole process and urql's document
 * cache has no TTL, so SSR routes would freeze at their first post-boot fetch.
 */
export const wpGraphqlClient = new Client({
  exchanges: [fetchExchange],
  fetchOptions: {
    headers: {
      Authorization: `Basic ${Buffer.from(`${WP_AUTH_USER}:${WP_AUTH_PASS}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
  },
  url: WP_API,
});

/**
 * Query WPGraphQL and throw on failure.
 *
 * urql resolves rather than rejects — a 401, a schema drift or a WP 500 all arrive
 * as `result.error` with `data: undefined`. Without this guard callers optional-chain
 * past it and a successful build ships empty pages.
 */
export const wpQuery = async <TData, TVariables extends AnyVariables>(
  query: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
): Promise<TData> => {
  const result = await wpGraphqlClient.query(query, variables).toPromise();

  if (result.error) {
    throw new Error(`WPGraphQL query failed: ${result.error.message}`);
  }

  if (!result.data) {
    throw new Error("WPGraphQL query returned no data");
  }

  return result.data;
};
