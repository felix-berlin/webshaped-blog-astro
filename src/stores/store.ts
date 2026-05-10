import type { TranslationRoutes } from "@layouts/DefaultLayout.astro";

import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

export type Language = "de" | "en";

export const currentLanguage = atom<string>("de");

// export const currentLanguage = persistentAtom<Language>("language", "en", {
//   encode(value: Language) {
//     return JSON.stringify(value);
//   },
//   decode(value: string): Language {
//     try {
//       return JSON.parse(value);
//     } catch {
//       value;
//     }
//   },
// });

export const translationRoutes = atom<TranslationRoutes | undefined>({});

// if (typeof window !== "undefined") {
//   window.addEventListener("load", () => {
//     const language = navigator.language;
//     const langShort = language.split("-")[0] as Language;
//     const systemLang = getLangFromUrl(new URL(window.location.href));

//     if (langShort === systemLang) {
//       currentLanguage.set(langShort);
//     } else {
//       currentLanguage.set(systemLang);
//     }
//   });
// }

export type LoadingStateValue = "empty" | "loaded" | "loading";
export const loadingState = atom<LoadingStateValue>("empty");

export type WebmentionsCount = number;
export const currentWebmentionsCount = atom<WebmentionsCount>(0);

export type DarkMode = boolean;

export const isDarkMode = persistentAtom<DarkMode>("darkMode", false, {
  decode(value) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  encode(value) {
    return JSON.stringify(value);
  },
});

export interface Guest {
  author?: string;
  email?: string;
  privacy?: boolean;
  saveUser?: boolean;
  url?: string;
}

export const guest = persistentAtom<Guest>(
  "guest",
  {
    saveUser: false,
  },
  {
    decode(value) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
    encode(value) {
      return JSON.stringify(value);
    },
  },
);

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  prompt(): Promise<void>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

// FIXME: PWA is not working (manifest is not found ect.)
export const installPrompt = atom<BeforeInstallPromptEvent | null>(null);
export const pwaReadyToInstall = atom<boolean>(false);

// if (typeof window !== "undefined") {
//   window.addEventListener("beforeinstallprompt", (event) => {
//     event.preventDefault();

//     installPrompt.set(event as BeforeInstallPromptEvent);
//     pwaReadyToInstall.set(true);
//   });
// }

/**
 * Triggers the PWA install prompt.
 *
 * @return  {Promise<void>}
 */
// export const triggerPwaInstall = async (): Promise<void> => {
//   if (!installPrompt.get()) return;

//   await installPrompt?.get()?.prompt();
//   // console.log(`Install prompt was: ${result?.outcome}`);

//   disableInAppInstallPrompt();
// };

/**
 * Disables the PWA install prompt.
 *
 * @return  {void}
 */
// export const disableInAppInstallPrompt = (): void => {
//   installPrompt.set(null);
//   pwaReadyToInstall.set(false);
// };

export const isMobileBreakpoint = atom<boolean>(false);
export const windowWidth = atom<number>(0);
