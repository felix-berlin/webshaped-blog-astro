import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { getLangFromUrl } from "@utils/i18n/utils";

export type Language = "en" | "de";

export const currentLanguage = persistentAtom<Language>("language", "en", {
  encode(value: Language) {
    return JSON.stringify(value);
  },
  decode(value: string): Language {
    try {
      return JSON.parse(value);
    } catch {
      value;
    }
  },
});

if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    const language = navigator.language;
    const langShort = language.split("-")[0] as Language;
    const systemLang = getLangFromUrl(new URL(window.location.href));

    if (langShort === systemLang) {
      currentLanguage.set(langShort);
    } else {
      currentLanguage.set(systemLang);
    }
  });
}

export type LoadingStateValue = "empty" | "loading" | "loaded";
export const loadingState = atom<LoadingStateValue>("empty");

export type WebmentionsCount = number;
export const currentWebmentionsCount = atom<WebmentionsCount>(0);

export type DarkMode = boolean;

export const isDarkMode = persistentAtom<DarkMode>("darkMode", false, {
  encode(value) {
    return JSON.stringify(value);
  },
  decode(value) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
});

export interface Guest {
  author?: string;
  email?: string;
  url?: string;
  privacy?: boolean;
  saveUser?: boolean;
}

export const guest = persistentAtom<Guest>(
  "guest",
  {
    saveUser: false,
  },
  {
    encode(value) {
      return JSON.stringify(value);
    },
    decode(value) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
  },
);

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const installPrompt = atom<BeforeInstallPromptEvent | null>(null);
export const pwaReadyToInstall = atom<boolean>(false);

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    installPrompt.set(event as BeforeInstallPromptEvent);
    pwaReadyToInstall.set(true);
  });
}

/**
 * Triggers the PWA install prompt.
 *
 * @return  {Promise<void>}
 */
export const triggerPwaInstall = async (): Promise<void> => {
  if (!installPrompt.get()) return;

  await installPrompt?.get()?.prompt();
  // console.log(`Install prompt was: ${result?.outcome}`);

  disableInAppInstallPrompt();
};

/**
 * Disables the PWA install prompt.
 *
 * @return  {void}
 */
export const disableInAppInstallPrompt = (): void => {
  installPrompt.set(null);
  pwaReadyToInstall.set(false);
};

export const isMobileBreakpoint = atom<boolean>(false);
export const windowWidth = atom<number>(0);
