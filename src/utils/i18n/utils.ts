import type { Maybe } from "@ts_types/generated/graphql";
import { getDelimiter } from "@utils/helpers";
// import { getCollection, type CollectionEntry } from "astro:content";
import de from "../../content/i18n/de-DE.json";
import en from "../../content/i18n/en-US.json";
import { localeStrings, defaultLang, showDefaultLang, routes } from "./ui";

const allTranslationsData = {
  de_DE: de,
  en_US: en,
};

export const getLangFromUrl = (url: URL) => {
  const [, lang] = url.pathname.split("/");

  if (lang in localeStrings) return lang as keyof typeof localeStrings;

  return defaultLang;
};

export const useTranslations = (lang: keyof typeof localeStrings) => {
  return function t(key: keyof (typeof localeStrings)[typeof defaultLang]) {
    return localeStrings[lang][key] || localeStrings[defaultLang][key];
  };
};

export const useTranslatedPath = (lang: keyof typeof localeStrings) => {
  return function translatePath(path: string, l: string = lang) {
    const pathName = path.replaceAll("/", "");
    const hasTranslation =
      defaultLang !== l && routes[l] !== undefined && routes[l][pathName] !== undefined;
    const translatedPath = hasTranslation ? `/${routes[l][pathName]}` : path;

    return !showDefaultLang && l === defaultLang ? translatedPath : `/${l}${translatedPath}`;
  };
};

export const getRouteFromUrl = (url: URL): string | undefined => {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split("/");
  const path = parts.pop() || parts.pop();

  if (path === undefined) {
    return undefined;
  }

  const currentLang = getLangFromUrl(url);

  if (defaultLang === currentLang) {
    const route = Object.values(routes)[0];
    console.log(route);
    console.log(path);

    return route[path] !== undefined ? route[path] : undefined;
  }

  const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  const reversedKey = getKeyByValue(routes[currentLang], path);
  console.log("reversedKey", reversedKey);

  if (reversedKey !== undefined) {
    return reversedKey;
  }

  return undefined;
};

/**
 * Selects the correct plural based on the language and the plural object supplied.
 *
 * @param   {string}  translationString  translation string
 * @param   {number}  count              number to determine the plural form
 * @param   {string}  locale             locale key
 *
 * @return  {string}                     return the plural string
 */
const pluralFormFor = (translationString: string, count: number, locale: string): string => {
  const pluralRules = new Intl.PluralRules(locale);
  const matchingForm = pluralRules.select(count);

  return translationString[matchingForm as keyof typeof translationString] as string;
};

/**
 * Looks up the translation string using the language key.
 * If variables are present, they are searched for and replaced within the string.
 * If the string should have a plural object, this will be analyzed before swapping the translation variables.
 *
 * @param   {string}  locale             locale key
 * @param   {string}  translationString  translation string
 * @param   {object}  varsToReplace      object with variables to replace
 * @param   {number}  plural             plural form in numbers
 *
 * @return  {string}                     return the translated string
 */
export const __ = (
  locale: Maybe<string>,
  translationString: string,
  varsToReplace?: object,
  plural?: number,
): string => {
  const langDelimiter = getDelimiter(locale!);

  const lang = langDelimiter === "-" ? locale : locale?.replace(langDelimiter!, "-");

  let translationStr: string = allTranslationsData[locale][translationString];

  if (typeof translationStr === "undefined" && import.meta.env.DEV) {
    console.warn(`${translationString} is not available in ${locale}`);
  }

  // If the translation string end with "--plural", execute the plural form function and store the result in the translation string.
  if (translationString.endsWith("--plural") && plural !== undefined && lang) {
    translationStr = pluralFormFor(translationStr, plural, lang);
  }

  // If there is a filled object with variables to replace, replace them.
  if (varsToReplace !== undefined && Object.keys(varsToReplace).length !== 0) {
    /**
     * Create a regular expression for each key in the object.
     * For example: { 'count': 'value', name: 'Jim' } will find {count} and { name } in the translation string.
     */
    const regex = new RegExp(`\\{\\s*(${Object.keys(varsToReplace).join("|")})\\s*\\}`, "gi");

    return translationStr.toString().replace(regex, (matched: string, offset: number) => {
      return varsToReplace[offset as keyof typeof varsToReplace];
    });
  }

  return translationStr || translationString;
};
