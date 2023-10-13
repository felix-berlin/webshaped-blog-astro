import type { Maybe } from "@ts_types/generated/graphql";
import { getDelimiter } from "@utils/helpers";
// import { getCollection, type CollectionEntry } from "astro:content";
import de from "../../content/i18n/de-DE.json";
import en from "../../content/i18n/en-US.json";

// TODO: Vite doesn't support astro:content yet, so we need to use a workaround.
// let translationsData: Record<string, CollectionEntry<"i18n">["data"]> = {};

// translationsData = Object.fromEntries(
//   (await getCollection("i18n")).map(({ id, data }) => [id, data] as const),
// );

// const allTranslationsData = {
//   de_DE: translationsData["de-DE"],
//   en_US: translationsData["en-US"],
// };

const allTranslationsData = {
  de_DE: de,
  en_US: en,
};

const availableLanguages = {
  en: "English",
  de: "Deutsch",
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
const pluralFormFor = (
  translationString: string,
  count: number,
  locale: string,
): string => {
  const pluralRules = new Intl.PluralRules(locale);
  const matchingForm = pluralRules.select(count);

  return translationString[
    matchingForm as keyof typeof translationString
  ] as string;
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
const __ = (
  locale: Maybe<string>,
  translationString: string,
  varsToReplace?: object,
  plural?: number,
): string => {
  const langDelimiter = getDelimiter(locale!);

  const lang =
    langDelimiter === "-" ? locale : locale?.replace(langDelimiter!, "-");

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
    const regex = new RegExp(
      `\\{\\s*(${Object.keys(varsToReplace).join("|")})\\s*\\}`,
      "gi",
    );

    return translationStr
      .toString()
      .replace(regex, (matched: string, offset: number) => {
        return varsToReplace[offset as keyof typeof varsToReplace];
      });
  }

  return translationStr || translationString;
};

export { __, availableLanguages };
