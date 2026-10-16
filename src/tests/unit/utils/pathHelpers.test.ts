import { getAuthorSocialItems } from "@utils/authorSocials";
import { mapMenuPaths, toIsoUtc } from "@utils/helpers";
import {
  buildTranslationRoutes,
  categoryPathBuilder,
  getLang,
  isLang,
  pagePathBuilder,
  postPathBuilder,
  rssPathBuilder,
  toLanguageCode,
} from "@utils/i18n/utils";
import { describe, expect, it } from "vitest";

describe("path & locale helpers", () => {
  it("getLang falls back to the default language for unknown locales", () => {
    expect(getLang("en")).toBe("en");
    expect(getLang("fr")).toBe("de");
    expect(getLang(undefined)).toBe("de");
  });

  it("isLang only accepts supported locales", () => {
    expect(isLang("de")).toBe(true);
    expect(isLang("fr")).toBe(false);
    expect(isLang(null)).toBe(false);
  });

  it("toLanguageCode maps slugs to the WPGraphQL enum", () => {
    expect(toLanguageCode("en")).toBe("EN");
  });

  it("builds post, page, rss and paginated category paths", () => {
    expect(postPathBuilder("hello", "en")).toBe("/en/posts/hello");
    expect(pagePathBuilder("impressum", "de")).toBe("/de/impressum");
    expect(rssPathBuilder("en")).toBe("/en/rss.xml");
    expect(categoryPathBuilder("javascript", "de")).toBe("/de/category/javascript/1");
    expect(categoryPathBuilder("css", "de", "3")).toBe("/de/category/css/3");
  });

  it("categoryPathBuilder strips WP's -de/-en slug suffixes", () => {
    expect(categoryPathBuilder("javascript-de", "de")).toBe("/de/category/javascript/1");
    expect(categoryPathBuilder("css-en", "en")).toBe("/en/category/css/1");
  });

  it("buildTranslationRoutes keeps supported locales with a path", () => {
    expect(
      buildTranslationRoutes([
        ["de", "/de/a"],
        ["en", null],
        ["fr", "/fr/a"],
        [undefined, "/x"],
      ]),
    ).toEqual({ de: "/de/a" });
  });

  it("toIsoUtc appends Z only when missing", () => {
    expect(toIsoUtc("2024-01-01T00:00:00")).toBe("2024-01-01T00:00:00Z");
    expect(toIsoUtc("2024-01-01T00:00:00Z")).toBe("2024-01-01T00:00:00Z");
    expect(toIsoUtc(null)).toBeUndefined();
  });
});

describe("mapMenuPaths()", () => {
  it("maps paths at every level without mutating the input", () => {
    const menu = {
      nodes: [{ path: "/a", childItems: { nodes: [{ path: "/b" }, { path: null }] } }],
    };

    const mapped = mapMenuPaths(menu, (path) => `/de${path}`);

    expect(mapped).toEqual({
      nodes: [{ path: "/de/a", childItems: { nodes: [{ path: "/de/b" }, { path: null }] } }],
    });
    expect(menu.nodes[0].path).toBe("/a");
  });

  it("passes null through", () => {
    expect(mapMenuPaths(null, (path) => path)).toBeNull();
  });
});

describe("getAuthorSocialItems()", () => {
  it("merges Yoast and custom socials, sizes them and marks GitHub/Mastodon rel=me", () => {
    const items = getAuthorSocialItems(
      {
        seo: { social: { __typename: "UserSocial", twitter: "https://x.com/me" } as never },
        socialAdvanced: { github: "https://github.com/me", mastodon: null } as never,
      },
      20,
    );

    expect(items).toEqual({
      github: { rel: "me", size: 20, url: "https://github.com/me" },
      twitter: { size: 20, url: "https://x.com/me" },
    });
  });
});
