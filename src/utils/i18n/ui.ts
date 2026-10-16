import de from "@/content/i18n/de-DE.json";
import en from "@/content/i18n/en-US.json";

export const localeStrings = {
  de,
  en,
};

export type Lang = keyof typeof localeStrings;

/** Every supported locale, in display order. */
export const LOCALES = Object.keys(localeStrings) as Lang[];

export const defaultLang: Lang = "de";

export const languages: Record<Lang, string> = {
  de: "Deutsch",
  en: "English",
};

/** BCP 47 tag per locale, for `Intl` formatting. */
export const localeTags: Record<Lang, string> = {
  de: "de-DE",
  en: "en-US",
};
