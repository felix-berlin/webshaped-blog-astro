import type { Maybe } from "../types/generated/graphql";

/**
 * Checks if the given string is HTML
 *
 * @param   {string}   str
 *
 * @return  {boolean}
 */
export const isHtml = (str: string): boolean => {
  const htmlTagRegex = /<[^>]*>/g;
  return htmlTagRegex.test(str);
};

/**
 * parse JSON string
 *
 * @param   {Maybe<string>}  str
 *
 * @return  {<string>}
 */
export const parse = (str: Maybe<string>) => {
  if (!str) return;

  return JSON.parse(str);
};

export const getHtmlContent = (str: string): string => {
  const htmlTagRegex = /<[^>]*>/g;
  return str.replace(htmlTagRegex, "");
};
