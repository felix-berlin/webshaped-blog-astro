import { firstCategoryPage, removeLocaleCode } from "@utils/helpers";

import type { LanguageCodeEnum } from "@/gql/graphql.ts";
import type { TranslationRoutes } from "@/types/i18n";

import { defaultLang, type Lang, localeStrings } from "./ui";

type TranslationKey = keyof (typeof localeStrings)[typeof defaultLang];
type TranslationValue = number | string;

const PLACEHOLDER = /\{\s*(\w+)\s*\}/g;
const pluralRules = new Map<Lang, Intl.PluralRules>();

/**
 * Returns a translate function `t(key, varsToReplace?, plural?)` for the given language.
 *
 * `{name}` placeholders are replaced from `varsToReplace`; keys ending in "--plural"
 * pick their form via `Intl.PluralRules` when `plural` is given. Missing keys fall
 * back to the default language, then to the key itself.
 */
export const useTranslations =
  (lang: Lang) =>
  (
    key: TranslationKey,
    varsToReplace?: Record<string, TranslationValue>,
    plural?: number,
  ): string => {
    const rawTranslation: Record<string, string> | string =
      localeStrings[lang][key] || localeStrings[defaultLang][key];

    const translationStr =
      key.endsWith("--plural") && plural !== undefined
        ? pluralFormFor(rawTranslation, plural, lang)
        : (rawTranslation as string);

    const replaced = varsToReplace
      ? translationStr?.replace(PLACEHOLDER, (match, name: string) =>
          name in varsToReplace ? String(varsToReplace[name] ?? "") : match,
        )
      : translationStr;

    return replaced || key;
  };

/** Selects the plural form for `count` from a `{ one, other, … }` translation object. */
const pluralFormFor = (
  translationForms: Record<string, string> | string,
  count: number,
  lang: Lang,
): string => {
  if (typeof translationForms === "string") return translationForms;

  let rules = pluralRules.get(lang);
  if (!rules) pluralRules.set(lang, (rules = new Intl.PluralRules(lang)));

  return translationForms[rules.select(count)] ?? "";
};

/** Path of a category archive page; WP's "-de"/"-en" slug suffixes are stripped. */
export const categoryPathBuilder = (categorySlug: string, lang: string, page = "1") =>
  `/${lang}/category/${firstCategoryPage(removeLocaleCode(categorySlug), page)}`;

/**
 * Builds the path for a post based on the provided slug and language.
 */
export const postPathBuilder = (postSlug: null | string | undefined, lang: string) =>
  `/${lang}/posts/${postSlug}`;

/** Path of a WP page (legal/about) served by `src/pages/[lang]/[pageSlug].astro`. */
export const pagePathBuilder = (pageSlug: string, lang: string) => `/${lang}/${pageSlug}`;

export const rssPathBuilder = (lang: string) => `/${lang}/rss.xml`;

export const isLang = (value: unknown): value is Lang =>
  typeof value === "string" && value in localeStrings;

/** A `[language slug, path]` pair as read from WPGraphQL — either side may be missing. */
export type TranslationEntry = [
  lang: null | string | undefined,
  path: false | null | string | undefined,
];

/**
 * Builds `TranslationRoutes` from `[language slug, path]` pairs, skipping entries
 * whose language isn't a supported locale or that have no path.
 */
export const buildTranslationRoutes = (entries: Iterable<TranslationEntry>): TranslationRoutes =>
  Object.fromEntries(
    [...entries].filter((entry): entry is [Lang, string] => isLang(entry[0]) && !!entry[1]),
  );

/**
 * Resolves `Astro.currentLocale` (or any locale string) to a supported language,
 * falling back to the default language.
 */
export const getLang = (locale: null | string | undefined): Lang =>
  isLang(locale) ? locale : defaultLang;

/** Maps a language slug to WPGraphQL's `LanguageCodeEnum`. */
export const toLanguageCode = (lang: Lang): LanguageCodeEnum =>
  lang.toUpperCase() as LanguageCodeEnum;
