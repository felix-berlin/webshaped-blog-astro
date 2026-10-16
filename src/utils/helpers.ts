import type { Lang } from "@i18n/ui";

import slugify from "slugify";

import type { GetMenuByIdQuery, UserSocialsFragment } from "@/gql/graphql.ts";

type Maybe<T> = null | T | undefined;
type MenuItem = NonNullable<MenuItemsConnection>["nodes"][number];
type MenuItemsConnection = NonNullable<GetMenuByIdQuery["menu"]>["menuItems"];
type SeoUserSocial = NonNullable<NonNullable<UserSocialsFragment["seo"]>["social"]>;
type SocialAdvanced = NonNullable<UserSocialsFragment["socialAdvanced"]>;

/**
 * Checks if the given string is HTML
 *
 * @param   {string}   str
 *
 * @return  {boolean}
 */
export const isHtml = (str: string): boolean => {
  if (!str) return false;
  if (typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");

    // If the parsed document contains elements, it's valid HTML
    return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
  }

  // Fallback for environments without DOMParser (e.g., Node.js)
  const htmlTagRegex = /<([a-z]+)([^<]*?(&[a-z]+;)?)*(?:>(.*?)<\/\1>|\s+\/>)$/gm;
  return htmlTagRegex.test(str.trim());
};

/**
 * parse JSON string
 *
 * @param   {Maybe<string>}  str
 *
 * @return  {string}
 */
export const parse = (str: Maybe<string>) => {
  if (!str) return;

  try {
    return JSON.parse(str);
  } catch (error) {
    throw new Error(`Failed to parse JSON string: ${error}`, { cause: error });
  }
};

/**
 * Get the text content of a HTML string
 *
 * @param   {string}  str
 *
 * @return  {string}
 */
export const getHtmlContent = (str: string): string => {
  const isValidHtml = /<[a-z][\s\S]*>/i.test(str);
  if (!isValidHtml) {
    console.error("The given string is not valid HTML");

    return "";
  }
  const htmlTagRegex = /<[^>]*>/g;
  let previous;
  do {
    previous = str;
    str = str.replace(htmlTagRegex, "");
  } while (str !== previous);
  return str;
};

/**
 * Anchor id for a heading — shared by the rendered heading and the TOC links,
 * which must produce the exact same value.
 */
export const headingId = (content: string): string =>
  isHtml(content) ? getHtmlContent(content) : slugify(content, { lower: true });

/**
 * Remove trailing slash from a string
 *
 * @param   {string}  str  - The string to remove the trailing slash from.
 *
 * @return  {string}       - The string without the trailing slash.
 */
export const removeTrailingSlash = (str: string): string => (str ?? "").replace(/\/$/, "");

/**
 * Create URL to the first page of a category
 *
 * @param   {string}  categoryPath
 *
 * @return  {string}
 */
export const firstCategoryPage = (categoryPath: Maybe<string>, firstPage = "1"): string =>
  `${categoryPath?.replace(/\/$/, "")}/${firstPage.replace(/^\//, "")}`;

/**
 * Check if the given path is a category path
 *
 * @param   {string}  path
 *
 * @return  {boolean}
 */
export const isCategoryPath = (path: Maybe<string>, categoryPath = "category"): boolean =>
  !!path?.includes(categoryPath);

type MenuLevel = { nodes: MenuNode[] };
type MenuNode = { childItems?: MenuLevel | null; path?: null | string };

/**
 * Returns a copy of a WP menu connection with every item's path (at every
 * level) mapped through `mapPath`. Never mutates its input, so processing the
 * same menu object twice can't stack prefixes.
 */
export const mapMenuPaths = <T extends MenuLevel | null | undefined>(
  menu: T,
  mapPath: (path: string) => string,
): T =>
  menu &&
  ({
    ...menu,
    nodes: menu.nodes.map((item) => ({
      ...item,
      childItems: mapMenuPaths(item.childItems, mapPath),
      path: item.path && mapPath(item.path),
    })),
  } as T);

/**
 * Point the main menu's category links (second level) at our first archive page.
 * German WP paths lack the "/de" prefix; English category slugs carry a "-en" suffix.
 */
export const updateCategoryPaths = (
  mainMenuItems: MenuItemsConnection,
  lang: Lang,
): MenuItemsConnection =>
  mainMenuItems && {
    ...mainMenuItems,
    nodes: mainMenuItems.nodes.map((item: MenuItem) => ({
      ...item,
      childItems: mapMenuPaths(item.childItems, (path) => {
        if (!isCategoryPath(path)) return path;
        return lang === "de"
          ? `/de${firstCategoryPage(path)}`
          : firstCategoryPage(removeLocaleCode(path));
      }),
    })),
  };

/**
 * Get the domain name without TDL from a URL
 *
 * @param   {string}  url - The URL from which to extract the domain name.
 *
 * @return  {string} The domain name extracted from the URL.
 * @throws  {Error} If the URL is not valid.
 */
export const getHostName = (url: string, hostnameOnly = false): string => {
  if (!isValidUrl(url) || !/^https?:\/\//.test(url)) throw new Error("Invalid URL");

  const parsedUrl = new URL(url);

  // remove tdl from hostname
  if (hostnameOnly) return parsedUrl.hostname.split(".").slice(0, -1).join(".");

  return parsedUrl.hostname;
};

/**
 * Rewrite a URL's scheme and host to the public site's origin, keeping its
 * path/query/hash. WordPress's Yoast SEO fields (canonical, opengraphUrl)
 * reflect the WP install's own configured URL (http, cms.webshaped.de)
 * rather than the public frontend that actually serves the page.
 *
 * @param   {string}  url - The absolute URL to rewrite.
 * @param   {string}  siteOrigin - The public site's origin, e.g. "https://webshaped.de".
 *
 * @return  {string} The URL with its origin replaced by siteOrigin.
 */
export const toSiteOrigin = (url: string, siteOrigin: string): string => {
  if (!isValidUrl(url)) {
    // An empty/absent value is a normal "nothing configured" case, already
    // guarded by callers — only a non-empty-but-unparseable string is a real
    // WordPress data problem worth surfacing (the exact bug class this
    // function exists to fix in the first place).
    if (url)
      console.error(`toSiteOrigin: received unparseable URL, passing through unchanged: ${url}`);
    return url;
  }
  const parsed = new URL(url);
  return new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, siteOrigin).toString();
};

// WPGraphQL's *Gmt fields serialize without a timezone suffix even though
// they're already UTC — append "Z" so they parse as valid ISO 8601 instants.
export const toIsoUtc = (value: null | string | undefined) =>
  value && !value.endsWith("Z") ? `${value}Z` : (value ?? undefined);

/**
 * Serialize a value as JSON for a `<script type="application/ld+json">` body.
 * `JSON.stringify` doesn't escape "<", so a "</script" inside CMS-sourced
 * content (a post title, author name, …) would terminate the tag early.
 *
 * @param   {unknown}  data
 *
 * @return  {string}
 */
export const toJsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, "\\u003c");

/**
 * Check if the given string is a valid URL
 *
 * @param   {string}   url
 *
 * @return  {boolean}
 */
export const isValidUrl = (url: string): boolean => typeof url === "string" && URL.canParse(url);

type AdditionalData = {
  [key: string]: object;
};

type SocialItems = {
  [key: string]: {
    [key: string]: unknown;
    url: string;
  };
};

/**
 * Return all needed data for the social icons
 *
 * @return  {SocialItems}
 */
export const getSocialIconData = (
  socials: SeoUserSocial | SocialAdvanced,
  iconStyles: object,
  additionalData: AdditionalData,
): SocialItems => {
  if (!socials) return {};
  const socialItems: SocialItems = {};

  for (const [key, value] of Object.entries(socials)) {
    if (!value || key === "__typename") continue;

    socialItems[key] = { url: String(value), ...iconStyles, ...additionalData[key] };
  }

  return socialItems;
};

export const removeLocaleCode = (category: null | string) => {
  if (!category) return "";
  return category.replace(/-(de|en)$/, "");
};

/**
 * Get the webmention URL for a given URL
 *
 * @param   {URL}  url  The URL of the current site
 *
 * @return  {string}
 */
export const WEBMENTION_IO = "https://webmention.io/";

export const getWebmentionsUrl = (url: URL): string => `${WEBMENTION_IO}${url.hostname}`;

// WP menu IDs are per language and have no queryable relation to the locale.
export const MENU_ID_BY_LANG: Record<Lang, string> = { de: "2", en: "125" };

type LanguageTagged = { language?: null | { slug?: null | string } };

/**
 * Filter a WPGraphQL posts response down to one language.
 *
 * `posts` can be `null` (post type unregistered) and individual posts can lack a
 * `language` relation (drafts) — both must degrade to "not included" rather than throw,
 * so a feed/listing renders empty instead of 500ing on a WordPress data gap.
 */
export const filterPostsByLanguage = <T extends LanguageTagged>(
  postsResponse: null | undefined | { posts?: null | { nodes?: (null | T)[] | null } },
  lang: string,
): T[] =>
  (postsResponse?.posts?.nodes ?? []).filter((post): post is T => post?.language?.slug === lang);
