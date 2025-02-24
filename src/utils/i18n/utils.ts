import { localeStrings, defaultLang, showDefaultLang, routes } from "./ui";

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
 * Hook to generate a translated path based on the provided language.
 *
 * @param lang - The language key to use for translation, which should be a key of the `localeStrings` object.
 * @returns A function that translates a given path to the specified language.
 *
 * The returned function takes the following parameters:
 * @param path - The original path to be translated.
 * @param l - The language key to translate the path to. Defaults to the `lang` parameter.
 * @returns The translated path. If the path does not have a translation, it returns the original path.
 * If `showDefaultLang` is false and the language is the default language, it returns the translated path without the language prefix.
 */
export const useTranslatedPath = (lang: keyof typeof localeStrings) => {
  return function translatePath(path: string, l: string = lang) {
    const pathName = path.replaceAll("/", "");
    const hasTranslation =
      defaultLang !== l && routes[l] !== undefined && routes[l][pathName] !== undefined;
    const translatedPath = hasTranslation ? `/${routes[l][pathName]}` : path;

    return !showDefaultLang && l === defaultLang ? translatedPath : `/${l}${translatedPath}`;
  };
};

/**
 * Retrieves the route from a given URL.
 *
 * @param url - The URL object from which to extract the route.
 * @returns The route as a string if found, otherwise `undefined`.
 *
 * This function extracts the pathname from the provided URL, splits it into parts,
 * and attempts to determine the route based on the current language and predefined routes.
 * If the current language matches the default language, it checks if the path exists in the routes.
 * If the current language is different, it reverses the lookup to find the corresponding key.
 */
export const getRouteFromUrl = (url: URL): string | undefined => {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split("/");
  const path = parts.pop();

  if (path === undefined) {
    return undefined;
  }

  const currentLang = getLangFromUrl(url);

  if (defaultLang === currentLang) {
    const route = Object.values(routes)[0];

    return route[path] !== undefined ? route[path] : undefined;
  }

  const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  const reversedKey = getKeyByValue(routes[currentLang], path);

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
