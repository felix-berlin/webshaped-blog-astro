import { fetchAPI, fetchApiWithAuth, gqlApi } from "@services/fetchApi";
import { gql } from "@urql/core";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { it, expect, describe, beforeAll, afterAll, afterEach } from "vitest";

// WP_API from astro:env/client resolves to .env value
const WP_API_URL = "https://test.webshaped.test/api";

const server = setupServer(
  http.post(WP_API_URL, () => {
    return HttpResponse.json({ data: { posts: [] } });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("fetchAPI", () => {
  it("makes a POST request to WP_API", async () => {
    let requestMade = false;
    server.use(
      http.post(WP_API_URL, () => {
        requestMade = true;
        return HttpResponse.json({ data: { hello: "world" } });
      }),
    );
    await fetchAPI("{ posts { id } }");
    expect(requestMade).toBe(true);
  });

  it("returns parsed JSON data on success", async () => {
    server.use(
      http.post(WP_API_URL, () => {
        return HttpResponse.json({ data: { value: 42 } });
      }),
    );
    const result = await fetchAPI("{ value }");
    expect(result).toEqual({ data: { value: 42 } });
  });

  it("handles error response and returns undefined", async () => {
    server.use(
      http.post(WP_API_URL, () => {
        return new HttpResponse("Server Error", { status: 500 });
      }),
    );
    const result = await fetchAPI("{ broken }");
    expect(result).toBeUndefined();
  });

  it("sends variables with the request", async () => {
    let receivedBody: any = null;
    server.use(
      http.post(WP_API_URL, async ({ request }) => {
        receivedBody = await request.json();
        return HttpResponse.json({ data: {} });
      }),
    );
    await fetchAPI("query($id: ID!) { post(id: $id) { id } }", { variables: { id: "1" } });
    expect(receivedBody?.variables).toEqual({ id: "1" });
  });
});

describe("fetchApiWithAuth", () => {
  it("makes a POST request with Authorization header", async () => {
    let authHeader: string | null = null;
    server.use(
      http.post(WP_API_URL, ({ request }) => {
        authHeader = request.headers.get("Authorization");
        return HttpResponse.json({ data: {} });
      }),
    );
    await fetchApiWithAuth("my-token", "{ posts { id } }");
    expect(authHeader).toBe("Bearer my-token");
  });

  it("returns parsed JSON data on success", async () => {
    server.use(
      http.post(WP_API_URL, () => {
        return HttpResponse.json({ data: { authenticated: true } });
      }),
    );
    const result = await fetchApiWithAuth("token", "{ secure }");
    expect(result).toEqual({ data: { authenticated: true } });
  });

  it("handles error response and returns undefined", async () => {
    server.use(
      http.post(WP_API_URL, () => {
        return new HttpResponse("Unauthorized", { status: 401 });
      }),
    );
    const result = await fetchApiWithAuth("bad-token", "{ protected }");
    expect(result).toBeUndefined();
  });
});

describe("gqlApi", () => {
  const testQuery = gql`
    query TestQuery {
      posts {
        id
        title
      }
    }
  `;

  it("returns data on success", async () => {
    server.use(
      http.get(WP_API_URL, () => {
        return HttpResponse.json({ data: { posts: [{ id: "1", title: "Test" }] } });
      }),
    );
    const result = await gqlApi(testQuery as any, {});
    expect(result).toEqual({ posts: [{ id: "1", title: "Test" }] });
  });

  it("throws when result.error is present", async () => {
    server.use(
      http.get(WP_API_URL, () => {
        return HttpResponse.json({
          errors: [{ message: "Something went wrong" }],
        });
      }),
    );
    await expect(gqlApi(testQuery as any, {})).rejects.toThrow();
  });

  it("throws when no data is returned", async () => {
    server.use(
      http.get(WP_API_URL, () => {
        return HttpResponse.json({ data: null });
      }),
    );
    await expect(gqlApi(testQuery as any, {})).rejects.toThrow("No data returned");
  });
});
