import { atom, onMount } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";

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
