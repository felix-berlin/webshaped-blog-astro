import { cacheExchange, Client, fetchExchange } from "@urql/core";
import { WP_API } from "astro:env/client";
import { WP_AUTH_PASS, WP_AUTH_USER } from "astro:env/server";

/**
 * Shared, authenticated urql Client for server-side WPGraphQL requests.
 * WPGraphQL requires authentication for all requests — this sends HTTP Basic Auth
 * using an Application Password (WP core, no plugin needed).
 */
export const wpGraphqlClient = new Client({
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    headers: {
      Authorization: `Basic ${Buffer.from(`${WP_AUTH_USER}:${WP_AUTH_PASS}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
  },
  url: WP_API,
});
