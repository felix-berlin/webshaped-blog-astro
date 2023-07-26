import de_DE from "./de-DE";
import en_US from "./en-US";
import type { Maybe } from "../types/generated/graphql";

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
  locale: string
): string => {
  const matchingForm = new Intl.PluralRules(locale).select(count);

  return translationString[+matchingForm];
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
  plural?: number
): string => {
  const lang = locale?.replace("_", "-");
  const translations: object = { de_DE, en_US };

  // If the translation string is not available, return the translation string itself.
  let translationStr: string =
    translations[locale as keyof typeof translations][translationString];

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
      "gi"
    );

    if (typeof translationStr === "undefined") {
      return "";
    }

    return translationStr
      .toString()
      .replace(regex, (matched: string, offset: number, string: string) => {
        return varsToReplace[offset as keyof typeof varsToReplace];
      });
  }

  return translationStr || translationString;
};

export { __, availableLanguages };
