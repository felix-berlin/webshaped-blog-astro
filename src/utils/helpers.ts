import type {
  Maybe,
  Menu,
  MenuItem,
  SeoUserSocial,
  SocialAdvanced,
} from "@ts_types/generated/graphql";

/**
 * Checks if the given string is HTML
 *
 * @param   {string}   str
 *
 * @return  {boolean}
 */
export const isHtml = (str: string): boolean => {
  if (!str) return false;
  const htmlTagRegex = /<([a-z]+)([^<]+|&[a-z]+;)*(?:>(.*)<\/\1>|\s+\/>)$/gm;
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
  return str.replace(htmlTagRegex, "");
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
 * @return  {[type]}
 */
export const updateCategoryPaths = (mainMenuItems: Maybe<Menu>): Maybe<Menu> => {
  mainMenuItems?.menuItems?.nodes.forEach((item: MenuItem) => {
    if (item?.childItems) {
      item.childItems.nodes.forEach((childItem: MenuItem) => {
        if ("path" in childItem && isCategoryPath(childItem.path)) {
          childItem.path = firstCategoryPage(childItem.path);
        }
      });
    }
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
 * Get the domain name from a URL
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
