import { browser, createI18n, localeFrom } from "@nanostores/i18n";
import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

export const localeSettings = persistentAtom<string>("locale");

export const locale = localeFrom(
  localeSettings,
  browser({ available: ["en", "de"], fallback: "en" }),
);

export const i18n = createI18n(locale, {
  async get(code) {
    return await fetch(`/locales/${code}.json`).then((r) => r.json());
  },
});

export type currentLocale = string;
export const currentLanguage = atom<currentLocale>("");
