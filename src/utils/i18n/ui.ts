import de from "../../content/i18n/de-DE.json";
import en from "../../content/i18n/en-US.json";

export const languages = {
  en: "English",
  de: "Deutsch",
};

export const defaultLang = "de";

export const showDefaultLang = true;

export const localeStrings = {
  en,
  de,
};

type Routes = {
  [key: string]: {
    [key: string]: string;
  };
};

export const routes: Routes = {
  de: {
    "new-index": "neuer-index",
  },
  en: {
    "new-index": "new-index",
  },
};
