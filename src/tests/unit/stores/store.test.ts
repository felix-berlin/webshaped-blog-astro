import { useTestStorageEngine, setTestStorageKey, cleanTestStorage } from "@nanostores/persistent";
import { isDarkMode, guest } from "@stores/store";
import { it, expect, describe, beforeAll, afterEach } from "vitest";

describe("store atoms", () => {
  beforeAll(() => {
    useTestStorageEngine();
  });

  afterEach(() => {
    cleanTestStorage();
  });

  describe("isDarkMode (persistent atom)", () => {
    it("has default value of false", () => {
      setTestStorageKey("darkMode", "false");
      expect(isDarkMode.get()).toBe(false);
    });

    it("encodes and decodes boolean values correctly", () => {
      isDarkMode.set(true);
      expect(isDarkMode.get()).toBe(true);
      isDarkMode.set(false);
      expect(isDarkMode.get()).toBe(false);
    });
  });

  describe("guest (persistent atom)", () => {
    it("has default value with saveUser false", () => {
      setTestStorageKey("guest", JSON.stringify({ saveUser: false }));
      expect(guest.get()).toEqual({ saveUser: false });
    });

    it("can store guest data", () => {
      guest.set({ author: "Felix", email: "felix@test.de", saveUser: true });
      expect(guest.get()).toEqual({ author: "Felix", email: "felix@test.de", saveUser: true });
    });
  });
});
