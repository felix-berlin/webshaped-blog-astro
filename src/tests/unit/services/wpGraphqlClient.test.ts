import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GetAuthorDocument, GetMenuByIdDocument } from "@/gql/graphql.ts";

import { server } from "../../mocks/node.ts";

const WP_API = "https://cms.webshaped.test/graphql";

// astro:env/server throws outside a server runtime, so stub it before the module
// under test resolves its imports.
vi.mock("astro:env/server", () => ({
  WP_AUTH_PASS: "app pass word",
  WP_AUTH_USER: "wp-user",
}));
vi.mock("astro:env/client", () => ({ WP_API }));

const { wpQuery, wpQueryChrome } = await import("@services/wpGraphqlClient");

afterEach(() => {
  vi.restoreAllMocks();
});

describe("wpQuery", () => {
  it("sends HTTP Basic Auth built from the Application Password", async () => {
    let authHeader: null | string = null;

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

  it("returns the response data", async () => {
    server.use(http.all(WP_API, () => HttpResponse.json({ data: { user: { name: "Felix" } } })));

    await expect(wpQuery(GetAuthorDocument, {})).resolves.toEqual({ user: { name: "Felix" } });
  });

  it("forwards variables to the server", async () => {
    let receivedVariables: unknown = null;

    server.use(
      // urql issues GET for queries, so the variables ride in the query string.
      http.all(WP_API, ({ request }) => {
        receivedVariables = JSON.parse(
          new URL(request.url).searchParams.get("variables") ?? "null",
        );

        return HttpResponse.json({ data: { menu: null } });
      }),
    );

    await wpQuery(GetMenuByIdDocument, { id: "125" });

    expect(receivedVariables).toEqual({ id: "125" });
  });

  it("keeps partial data and logs rather than throwing", async () => {
    // WPGraphQL answers HTTP 200 with both data and errors when a single node is
    // unresolvable — dropping the good posts over one broken one is worse.
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    server.use(
      http.all(WP_API, () =>
        HttpResponse.json({
          data: { user: { name: "Felix" } },
          errors: [{ message: "Cannot resolve avatar." }],
        }),
      ),
    );

    await expect(wpQuery(GetAuthorDocument, {})).resolves.toEqual({ user: { name: "Felix" } });
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining("partial errors"));
  });

  it("throws on GraphQL errors when no data came back", async () => {
    server.use(
      http.all(WP_API, () =>
        HttpResponse.json({ errors: [{ message: "Unauthenticated." }] }, { status: 401 }),
      ),
    );

    await expect(wpQuery(GetAuthorDocument, {})).rejects.toThrow(/Unauthenticated/);
  });

  it("throws on a non-GraphQL transport failure", async () => {
    // The realistic outage: nginx answers with an HTML 502, so urql produces a
    // network/parse error rather than a GraphQL one.
    server.use(http.all(WP_API, () => new HttpResponse("<html>502</html>", { status: 502 })));

    await expect(wpQuery(GetAuthorDocument, {})).rejects.toThrow(/returned no data/);
  });

  it("names the failing operation in the error", async () => {
    server.use(http.all(WP_API, () => HttpResponse.json({ data: null })));

    await expect(wpQuery(GetMenuByIdDocument, { id: "2" })).rejects.toThrow(/GetMenuById/);
  });

  it("does not cache — a second call sees fresh data", async () => {
    // The client deliberately omits cacheExchange; urql's document cache has no
    // TTL, so a long-lived SSR process would otherwise freeze at its first fetch.
    let call = 0;

    server.use(
      http.all(WP_API, () => {
        call += 1;

        return HttpResponse.json({ data: { user: { name: `Felix ${call}` } } });
      }),
    );

    await expect(wpQuery(GetAuthorDocument, {})).resolves.toEqual({ user: { name: "Felix 1" } });
    await expect(wpQuery(GetAuthorDocument, {})).resolves.toEqual({ user: { name: "Felix 2" } });
  });
});

describe("wpQueryChrome", () => {
  it("returns null instead of throwing, so the 404 page still renders", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    server.use(http.all(WP_API, () => HttpResponse.json({ data: null })));

    await expect(wpQueryChrome(GetAuthorDocument, {})).resolves.toBeNull();
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining("chrome query failed"));
  });

  it("passes data through when the query succeeds", async () => {
    server.use(http.all(WP_API, () => HttpResponse.json({ data: { user: { name: "Felix" } } })));

    await expect(wpQueryChrome(GetAuthorDocument, {})).resolves.toEqual({
      user: { name: "Felix" },
    });
  });
});
