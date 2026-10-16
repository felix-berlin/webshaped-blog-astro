import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("astro:env/server", () => ({ GITHUB_TOKEN: "token" }));
vi.mock("@sentry/astro", () => ({ captureException: vi.fn() }));

// Mock the urql transport: answer each GitHub query by its operation name.
const queryMock = vi.fn();
vi.mock("@urql/core", () => ({
  Client: class {
    query(query: { definitions: Array<{ name?: { value: string } }> }, variables: unknown) {
      return { toPromise: () => queryMock(query.definitions[0]?.name?.value, variables) };
    }
  },
  fetchExchange: {},
}));

const repo = (name: string, stars: number, languages: Array<[string, number]>) => ({
  description: null,
  languages: { edges: languages.map(([language, size]) => ({ node: { name: language }, size })) },
  name,
  stargazerCount: stars,
  url: `https://github.com/me/${name}`,
});

const mockGitHub = () =>
  queryMock.mockImplementation(async (operation: string, variables: { after?: null | string }) => {
    if (operation === "GhSingleRepo")
      return { data: { repository: repo("extra", 5, [["Vue", 100]]) } };
    const firstPage = !variables.after;
    return {
      data: {
        viewer: {
          repositories: {
            nodes: firstPage
              ? [repo("a", 1, [["TypeScript", 300]])]
              : [repo("b", 10, [["Vue", 100]])],
            pageInfo: { endCursor: "c1", hasNextPage: firstPage },
          },
        },
      },
    };
  });

beforeEach(() => {
  vi.resetModules();
  queryMock.mockReset();
});

describe("GET /api/github/stats", () => {
  it("aggregates languages and the most starred repos across pages and extra repos", async () => {
    mockGitHub();
    const { GET } = await import("@/pages/api/github/stats");

    const stats = await (await GET()).json();

    expect(stats.languagePercentages).toEqual([
      { language: "TypeScript", percentage: 60 },
      { language: "Vue", percentage: 40 },
    ]);
    expect(stats.mostStarredRepos.map((r: { name: string }) => r.name)).toEqual([
      "b",
      "extra",
      "a",
    ]);
    expect(stats.mostStarredRepos[0].description).toBe("No description available");
  });

  it("serves repeated requests from the in-process cache", async () => {
    mockGitHub();
    const { GET } = await import("@/pages/api/github/stats");

    await GET();
    const callsAfterFirst = queryMock.mock.calls.length;
    await GET();

    expect(queryMock.mock.calls.length).toBe(callsAfterFirst);
  });

  it("returns 500 and does not cache a failed crawl", async () => {
    queryMock.mockResolvedValue({ error: { message: "rate limited" } });
    const { GET } = await import("@/pages/api/github/stats");

    const response = await GET();
    expect(response.status).toBe(500);

    mockGitHub();
    expect((await GET()).status).toBe(200);
  });
});
