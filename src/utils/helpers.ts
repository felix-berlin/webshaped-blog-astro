import type {
  Maybe,
  MenuItem,
  SeoUserSocial,
  SocialAdvanced,
  MenuToMenuItemConnection,
} from "@/gql/graphql.ts";

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
    throw new Error(`Failed to parse JSON string: ${error}`);
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
 * Create URL to the first page of a category
 *
 * @param   {string}  categoryPath
 *
 * @return  {string}
 */
export const firstCategoryPage = (categoryPath: Maybe<string>, firstPage = "1"): string => {
  if (firstPage.startsWith("/")) {
    firstPage = firstPage.slice(1);
  }

  if (categoryPath?.endsWith("/")) {
    categoryPath = categoryPath.slice(0, -1);
  }

  return `${categoryPath}/${firstPage}`;
};

/**
 * Check if the given path is a category path
 *
 * @param   {string}  path
 *
 * @return  {boolean}
 */
export const isCategoryPath = (path: Maybe<string>, categoryPath = "category"): boolean => {
  if (!path) return false;
  // if path contains 'category' is within the path string return true
  return path?.includes(categoryPath);
};

/**
 * Update category paths in the main menu
 *
 */
export const updateCategoryPaths = (
  mainMenuItems: MenuToMenuItemConnection,
  lang: "de" | "en",
): Maybe<MenuItem[]> => {
  mainMenuItems?.nodes.forEach((item: MenuItem) => {
    if (!item?.childItems) return;

    // Loop through the child items (menu item) of the main menu
    item.childItems.nodes.forEach((childItem: MenuItem) => {
      if (!("path" in childItem && isCategoryPath(childItem.path))) {
        return;
      }

      // In german locale, /de is missing in the path
      if (lang === "de") {
        childItem.path = `/de${firstCategoryPage(childItem.path)}`;
      }
      // In english locale, categories are postfixed with "-en", we need to remove it
      if (lang === "en") {
        childItem.path = firstCategoryPage(removeLocaleCode(childItem.path));
      }
    });
  });

  return mainMenuItems;
};

/**
 * Get special characters from a string
 *
 * @param   {string}       str
 * @param   {string[]}  specialChars
 *
 * @return  {string | null}
 */
export const getDelimiter = (
  str: string,
  specialChars: string[] = ["_", "-", "*"],
): string | null => {
  if (!str || !Array.isArray(specialChars) || specialChars.some((char) => typeof char !== "string"))
    return null;

  return specialChars.find((specialChar) => str.includes(specialChar)) || null;
};

/**
 * Capitalize the first letter of a string
 *
 * @param   {string}  str
 *
 * @return  {string}
 */
export const capitalize = (str: string | null | undefined): string => {
  if (str == null || typeof str === "undefined" || typeof str !== "string") {
    return "";
  }

  str = str?.trim(); // Trim the input string to remove leading and trailing whitespaces

  const firstChar = str.charAt(0);
  const restOfString = str.slice(1);

  if (/[a-zA-Z]/.test(firstChar)) {
    return `${firstChar.toUpperCase()}${restOfString}`;
  } else {
    return `${firstChar}${restOfString}`;
  }
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
  if (
    url === null ||
    typeof url === "undefined" ||
    !isValidUrl(url) ||
    (!url.startsWith("http://") && !url.startsWith("https://"))
  )
    throw new Error("Invalid URL");

  const parsedUrl = new URL(url);

  // remove tdl from hostname
  if (hostnameOnly) return parsedUrl.hostname.split(".").slice(0, -1).join(".");

  return parsedUrl.hostname;
};

/**
 * Check if the given string is a valid URL
 *
 * @param   {string}   url
 *
 * @return  {boolean}
 */
export const isValidUrl = (url: string): boolean => {
  if (url === null || typeof url === "undefined" || typeof url !== "string" || url === "") {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

type AdditionalData = {
  [key: string]: object;
};

type SocialItems = {
  [key: string]: {
    url: string;
    [key: string]: string;
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
    if (!value) continue;

    socialItems[key] = { url: value, ...iconStyles };

    if (additionalData[key]) {
      socialItems[key] = { ...socialItems[key], ...additionalData[key] };
    }
  }

  return socialItems;
};

export const isWebWorkerSupported = () => {
  return typeof Worker !== "undefined";
};

export const removeLocaleCode = (category: string | null) => {
  if (!category) return "";
  // Split the category string by the hyphen
  const parts = category.split("-");

  // Return the first part of the split string
  return parts[0];
};

/**
 * Get the webmention URL for a given URL
 *
 * @param   {URL}  url  The URL of the current site
 *
 * @return  {string}
 */
export const getWebmentionsUrl = (url: URL): string => {
  const siteDomain = new URL(url).hostname;
  const webmentionUrlStart = "https://webmention.io/";
  return `${webmentionUrlStart}${siteDomain}`;
};

/**
 * WPGraphQL API: Convert a flat list of items to a hierarchical structure
 * @see: https://www.wpgraphql.com/docs/hierarchical-data#converting-flat-lists-to-hierarchical
 */
export function flatListToHierarchical<T extends Record<string, any>>(
  data: T[] = [],
  options: {
    idKey?: keyof T;
    parentKey?: keyof T;
    childrenKey?: string;
  } = {},
): T[] {
  const { idKey = "id", parentKey = "parentId", childrenKey = "children" } = options;

  const tree: T[] = [];
  const childrenOf: Record<string | number, T[]> = {};

  data.forEach((item) => {
    const newItem = { ...item };
    const id = newItem[idKey];
    // parentId can be undefined or null, treat as 0 (root)
    const parentId = newItem[parentKey] ?? 0;

    childrenOf[id] = childrenOf[id] || [];
    newItem[childrenKey] = childrenOf[id];

    if (parentId && parentId !== 0) {
      childrenOf[parentId] = childrenOf[parentId] || [];
      childrenOf[parentId].push(newItem);
    } else {
      tree.push(newItem);
    }
  });

  return tree;
}
