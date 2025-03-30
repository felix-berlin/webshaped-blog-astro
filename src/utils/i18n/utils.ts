import { localeStrings, defaultLang } from "./ui";
import { firstCategoryPage, removeLocaleCode } from "@utils/helpers";

/**
 * Extracts the language code from the given URL's pathname.
 *
 * @param url - The URL object from which to extract the language code.
 * @returns The extracted language code if it exists in `localeStrings`, otherwise returns `defaultLang`.
 */
export const getLangFromUrl = (url: URL) => {
  const [, lang] = url.pathname.split("/");

  if (lang in localeStrings) return lang as keyof typeof localeStrings;

  return defaultLang;
};

/**
 * Custom hook to use translations based on the provided language.
 *
 * @param   {keyof typeof localeStrings}  lang  The language key to use for translations.
 *
 * @return  {function}  A function to get the translated string.
 *
 * The returned function `t` has the following parameters:
 *
 * @param   {keyof (typeof localeStrings)[typeof defaultLang]}  key             The locale key to look up the translation string.
 * @param   {object}                                            varsToReplace   An optional object with variables to replace in the translation string.
 * @param   {number}                                            plural          An optional number to determine the plural form.
 *
 * @return  {string}  The translated string, with variables replaced and plural form applied if applicable.
 */
export const useTranslations = (lang: keyof typeof localeStrings): Function => {
  const shortLang = lang?.includes("_") ? (lang.split("_")[0] as keyof typeof localeStrings) : lang;

  /**
   * Looks up the translation string using the language key.
   * If variables are present, they are searched for and replaced within the string.
   * If the string should have a plural object, this will be analyzed before swapping the translation variables.
   *
   * @param   {string}  key             locale key
   * @param   {object}  varsToReplace      object with variables to replace
   * @param   {number}  plural             plural form in numbers
   *
   * @return  {string}                     return the translated string
   */
  return function t(
    key: keyof (typeof localeStrings)[typeof defaultLang],
    varsToReplace?: object,
    plural?: number,
  ) {
    let translationStr = localeStrings[shortLang][key] || localeStrings[defaultLang][key];

    // If the translation string ends with "--plural", execute the plural form function and store the result in the translation string.
    if (key.endsWith("--plural") && plural !== undefined) {
      translationStr = pluralFormFor(translationStr, plural, shortLang);
    }

    // If there is a filled object with variables to replace, replace them.
    if (varsToReplace !== undefined && Object.keys(varsToReplace).length !== 0) {
      const regex = new RegExp(`\\{\\s*(${Object.keys(varsToReplace).join("|")})\\s*\\}`, "gi");

      translationStr = translationStr
        .toString()
        .replace(regex, (matched: string, offset: number) => {
          return varsToReplace[offset as keyof typeof varsToReplace];
        });
    }

    return translationStr || key;
  };
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
 * Builds the path for a category based on the provided slug and language.
 *
 * @param   {string}  categorySlug   The slug of the category.
 * @param   {string}  lang          The language code.
 *
 * @return  {string}                The constructed path for the category.
 */
export const categoryPathBuilder = (categorySlug: string, lang: string) => {
  return `/${lang}/category/${firstCategoryPage(removeLocaleCode(categorySlug))}`;
};
