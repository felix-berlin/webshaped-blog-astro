import { beforeEach, describe, expect, it, vi } from "vitest";

const captureExceptionMock = vi.fn();
vi.mock("@sentry/astro", () => ({ captureException: captureExceptionMock }));

const wpQueryMock = vi.fn();
vi.mock("@services/wpGraphqlClient", () => ({
  wpQuery: (...args: unknown[]) => wpQueryMock(...args),
}));

const { GET } = await import("@/pages/sitemap-index.xml");

const operationName = (query: { definitions: Array<{ name?: { value: string } }> }) =>
  query.definitions[0]?.name?.value;

const emptyPosts = { posts: { nodes: [] } };
const emptyCategories = { categories: { nodes: [] } };
const emptyPages = { pages: { nodes: [] } };

function mockResponses({
  categories = emptyCategories,
  pages = emptyPages,
  posts = emptyPosts,
}: {
  categories?: unknown;
  pages?: unknown;
  posts?: unknown;
} = {}) {
  wpQueryMock.mockImplementation((query: Parameters<typeof operationName>[0]) => {
    switch (operationName(query)) {
      case "GetPostsPreview":
        return Promise.resolve(posts);
      case "GetAllCategories":
        return Promise.resolve(categories);
      case "GetPagesBySlugs":
        return Promise.resolve(pages);
      default:
        throw new Error(`unexpected operation: ${operationName(query)}`);
    }
  });
}

async function getSitemap(mocks?: Parameters<typeof mockResponses>[0]) {
  mockResponses(mocks);
  const response = await GET({ site: new URL("https://webshaped.de") } as never);
  return response.text();
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /sitemap-index.xml", () => {
  it("drops a noindexed post and strips it from another post's hreflang alternates", async () => {
    const body = await getSitemap({
      posts: {
        posts: {
          nodes: [
            {
              dateGmt: "2026-01-01T00:00:00",
              language: { slug: "de" },
              modifiedGmt: null,
              seo: { metaRobotsNoindex: "noindex" },
              slug: "geheim",
              translations: [],
            },
            {
              dateGmt: "2026-01-02T00:00:00",
              language: { slug: "en" },
              modifiedGmt: null,
              seo: { metaRobotsNoindex: null },
              slug: "secret",
              translations: [{ language: { slug: "de" }, slug: "geheim" }],
            },
          ],
        },
      },
    });

    expect(body).not.toContain("/posts/geheim");
    expect(body).toContain("/posts/secret");
  });

  it("emits each category once, not duplicated via a children traversal", async () => {
    const body = await getSitemap({
      categories: {
        categories: {
          nodes: [
            { count: 3, language: { slug: "de" }, slug: "javascript", translations: [] },
            { count: 2, language: { slug: "de" }, slug: "css", translations: [] },
          ],
        },
      },
    });

    expect(body.match(/<loc>[^<]*category\/javascript\/1<\/loc>/g)).toHaveLength(1);
    expect(body.match(/<loc>[^<]*category\/css\/1<\/loc>/g)).toHaveLength(1);
  });

  it("paginates a category across multiple sitemap pages once its post count exceeds the page size", async () => {
    const body = await getSitemap({
      categories: {
        categories: { nodes: [{ count: 13, language: { slug: "de" }, slug: "big-category" }] },
      },
    });

    expect(body).toContain("category/big-category/1<");
    expect(body).toContain("category/big-category/2<");
    expect(body).toContain("category/big-category/3<");
    expect(body).not.toContain("category/big-category/4<");
  });

  it("emits both the German and English variant of a page as their own <url>, reciprocally alternate-linked", async () => {
    const body = await getSitemap({
      pages: {
        pages: {
          nodes: [
            {
              language: { slug: "de" },
              seo: { metaRobotsNoindex: null },
              slug: "impressum",
              translations: [
                { language: { slug: "en" }, seo: { metaRobotsNoindex: null }, slug: "imprint" },
              ],
            },
          ],
        },
      },
    });

    expect(body).toContain("<loc>https://webshaped.de/de/impressum</loc>");
    expect(body).toContain("<loc>https://webshaped.de/en/imprint</loc>");
    expect(body).toContain('hreflang="en"');
    expect(body).toContain('hreflang="de"');
  });

  it("escapes XML special characters in slugs", async () => {
    const body = await getSitemap({
      posts: {
        posts: {
          nodes: [
            {
              dateGmt: "2026-01-01T00:00:00",
              language: { slug: "de" },
              modifiedGmt: null,
              seo: { metaRobotsNoindex: null },
              slug: "foo-&-bar",
              translations: [],
            },
          ],
        },
      },
    });

    expect(body).toContain("foo-&amp;-bar");
    expect(body).not.toMatch(/foo-&(?!amp;)/);
  });

  it("degrades gracefully when one WordPress query fails, instead of 500ing the whole sitemap", async () => {
    wpQueryMock.mockImplementation((query: Parameters<typeof operationName>[0]) => {
      if (operationName(query) === "GetAllCategories") {
        return Promise.reject(new Error("WPGraphQL down"));
      }
      if (operationName(query) === "GetPostsPreview") {
        return Promise.resolve({
          posts: {
            nodes: [
              {
                dateGmt: "2026-01-01T00:00:00",
                language: { slug: "de" },
                modifiedGmt: null,
                seo: { metaRobotsNoindex: null },
                slug: "still-here",
                translations: [],
              },
            ],
          },
        });
      }
      return Promise.resolve(emptyPages);
    });

    const response = await GET({ site: new URL("https://webshaped.de") } as never);

    expect(response.status).toBe(200);
    expect(captureExceptionMock).toHaveBeenCalledOnce();
    const body = await response.text();
    expect(body).toContain("still-here");
  });
});
