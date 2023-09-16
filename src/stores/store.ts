import { atom, onMount, action } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import type { Language, Maybe } from "@ts_types/generated/graphql";

export const currentLanguage = persistentAtom<Maybe<Language>>(
  "language",
  {
    code: "EN",
    name: "English",
    locale: "en_US",
    slug: "en",
  },
  {
    encode(value: string) {
      return JSON.stringify(value);
    },
    decode(value: string): object | string {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
  },
);

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
export const showInstallButton = atom<boolean>(false);

onMount(installPrompt, () => {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    installPrompt.set(event as BeforeInstallPromptEvent);
    showInstallButton.set(true);
  });
});

export const triggerPwaInstall = action(
  installPrompt,
  "triggerPwaInstall",
  async () => {
    if (!installPrompt.get()) return;

    const result = await installPrompt?.get()?.prompt();
    console.log(`Install prompt was: ${result?.outcome}`);

    disableInAppInstallPrompt();
  },
);

export const disableInAppInstallPrompt = action(
  installPrompt,
  "disableInAppInstallPrompt",
  () => {
    installPrompt.set(null);
    showInstallButton.set(false);
  },
);
