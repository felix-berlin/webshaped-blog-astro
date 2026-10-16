import { persistentAtom } from "@nanostores/persistent";

export type DarkMode = boolean;

// Shared by every persistent atom — falls back to the raw string when the
// stored value isn't valid JSON.
const jsonCodec = {
  decode(value: string) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  encode: JSON.stringify,
};

export const isDarkMode = persistentAtom<DarkMode>("darkMode", false, jsonCodec);

export interface Guest {
  author?: string;
  email?: string;
  privacy?: boolean;
  saveUser?: boolean;
  url?: string;
}

export const guest = persistentAtom<Guest>("guest", { saveUser: false }, jsonCodec);
