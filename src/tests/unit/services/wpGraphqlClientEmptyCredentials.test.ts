import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { GetAuthorDocument } from "@/gql/graphql.ts";

import { server } from "../../mocks/node.ts";

const WP_API = "https://cms.webshaped.test/graphql";

// Empty strings pass Astro's envField optional:false check (it validates presence,
// not non-emptiness) — this file is a separate module instance so it can mock
// astro:env/server with blank credentials without affecting wpGraphqlClient.test.ts.
vi.mock("astro:env/server", () => ({ WP_AUTH_PASS: "", WP_AUTH_USER: "" }));
vi.mock("astro:env/client", () => ({ WP_API }));
vi.mock("@sentry/astro", () => ({ captureException: vi.fn() }));

const { wpQuery } = await import("@services/wpGraphqlClient");

describe("wpQuery with empty credentials", () => {
  it("still sends a Basic Auth header, not an unauthenticated request", async () => {
    let authHeader: null | string = null;

    server.use(
      http.all(WP_API, ({ request }) => {
        authHeader = request.headers.get("Authorization");

        return HttpResponse.json({ errors: [{ message: "Unauthenticated." }] }, { status: 401 });
      }),
    );

    await expect(wpQuery(GetAuthorDocument, {})).rejects.toThrow();

    // A missing credential must never silently become "no Authorization header
    // at all" — that would be a different, harder-to-notice failure mode.
    expect(authHeader).toBe(`Basic ${btoa(":")}`);
  });

  it("surfaces the resulting auth failure instead of returning empty data", async () => {
    server.use(
      http.all(WP_API, () =>
        HttpResponse.json({ errors: [{ message: "Unauthenticated." }] }, { status: 401 }),
      ),
    );

    await expect(wpQuery(GetAuthorDocument, {})).rejects.toThrow(/Unauthenticated/);
  });
});
