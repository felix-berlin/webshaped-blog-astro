import type { Maybe } from "../types/generated/graphql";

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
export const firstCategoryPage = (categoryPath: string):string => {
  return `${categoryPath}/1`;
}
