import { WP_API } from "astro:env/client";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { GetAuthorDocument } from "@/gql/graphql.ts";

import { server } from "../../mocks/node.ts";

// astro:env/server throws outside a server runtime, so stub it before the module
// under test resolves its imports.
vi.mock("astro:env/server", () => ({
  WP_AUTH_PASS: "app pass word",
  WP_AUTH_USER: "wp-user",
}));

const { wpQuery } = await import("@services/wpGraphqlClient");

describe("wpQuery", () => {
  it("sends HTTP Basic Auth built from the Application Password", async () => {
    let authHeader: string | null = null;

    server.use(
      http.all(WP_API, ({ request }) => {
        authHeader = request.headers.get("Authorization");

        return HttpResponse.json({ data: { user: null } });
      }),
    );

    await wpQuery(GetAuthorDocument, {});

    // Spaces must survive — WP Application Passwords come in space-separated groups.
    expect(authHeader).toBe(`Basic ${btoa("wp-user:app pass word")}`);
  });

  it("throws on GraphQL errors instead of resolving empty", async () => {
    server.use(
      http.all(WP_API, () =>
        HttpResponse.json({ errors: [{ message: "Unauthenticated." }] }, { status: 401 }),
      ),
    );

    await expect(wpQuery(GetAuthorDocument, {})).rejects.toThrow(/WPGraphQL query failed/);
  });

  it("throws when the response carries no data", async () => {
    server.use(http.all(WP_API, () => HttpResponse.json({ data: null })));

    await expect(wpQuery(GetAuthorDocument, {})).rejects.toThrow(/WPGraphQL query/);
  });
});
