import type { Maybe, Menu, MenuItem, Block } from "@ts_types/generated/graphql";

/**
 * Checks if the given string is HTML
 *
 * @param   {string}   str
 *
 * @return  {boolean}
 */
export const isHtml = (str: string): boolean => {
  if (!str) return false;
  const htmlTagRegex = /<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/gm;
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
export const firstCategoryPage = (
  categoryPath: Maybe<string>,
  firstPage = "1",
): string => {
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
export const isCategoryPath = (
  path: Maybe<string>,
  categoryPath = "category",
): boolean => {
  if (!path) return false;
  // if path contains 'category' is within the path string return true
  return path?.includes(categoryPath);
};

/**
 * Update category paths in the main menu
 *
 * @return  {[type]}
 */
export const updateCategoryPaths = (
  mainMenuItems: Maybe<Menu>,
): Maybe<Menu> => {
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
  if (!str) return null;

  for (const specialChar of specialChars) {
    if (str.includes(specialChar)) {
      return specialChar;
    }
  }
  return null;
};

/**
 * Capitalize the first letter of a string
 *
 * @param   {string}  str
 *
 * @return  {string}
 */
export const capitalize = (str: string): string => {
  if (!str) return "";

  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get the TLD from a URL
 *
 * @param   {string}  url
 *
 * @return  {string}
 */
export const getDomainName = (url: string): string => {
  if (!url) return "";
  return url.replace(/.+\/\/|www.|\..+/g, "");
};
