import {
  currentLanguage,
  isDarkMode,
  guest,
  loadingState,
  currentWebmentionsCount,
  isMobileBreakpoint,
  windowWidth,
  translationRoutes,
} from "@stores/store";
import { useTestStorageEngine, setTestStorageKey, cleanTestStorage } from "@nanostores/persistent";
import { it, expect, describe, beforeAll, afterEach } from "vitest";

describe("store atoms", () => {
  beforeAll(() => {
    useTestStorageEngine();
  });

  afterEach(() => {
    cleanTestStorage();
  });

  describe("currentLanguage", () => {
    it("has default value of 'de'", () => {
      expect(currentLanguage.get()).toBe("de");
    });

    it("can be updated to 'en'", () => {
      currentLanguage.set("en");
      expect(currentLanguage.get()).toBe("en");
    });
  });

  describe("loadingState", () => {
    it("has default value of 'empty'", () => {
      expect(loadingState.get()).toBe("empty");
    });

    it("can be set to 'loading'", () => {
      loadingState.set("loading");
      expect(loadingState.get()).toBe("loading");
    });

    it("can be set to 'loaded'", () => {
      loadingState.set("loaded");
      expect(loadingState.get()).toBe("loaded");
    });
  });

  describe("currentWebmentionsCount", () => {
    it("has default value of 0", () => {
      expect(currentWebmentionsCount.get()).toBe(0);
    });

    it("can be updated", () => {
      currentWebmentionsCount.set(42);
      expect(currentWebmentionsCount.get()).toBe(42);
    });
  });

  describe("isMobileBreakpoint", () => {
    it("has default value of false", () => {
      expect(isMobileBreakpoint.get()).toBe(false);
    });

    it("can be set to true", () => {
      isMobileBreakpoint.set(true);
      expect(isMobileBreakpoint.get()).toBe(true);
    });
  });

  describe("windowWidth", () => {
    it("has default value of 0", () => {
      expect(windowWidth.get()).toBe(0);
    });

    it("can be updated", () => {
      windowWidth.set(1024);
      expect(windowWidth.get()).toBe(1024);
    });
  });

  describe("translationRoutes", () => {
    it("has default value of empty object", () => {
      expect(translationRoutes.get()).toEqual({});
    });

    it("can be updated with route map", () => {
      translationRoutes.set({ de: "/de/ueber-mich", en: "/en/about" });
      expect(translationRoutes.get()).toEqual({ de: "/de/ueber-mich", en: "/en/about" });
    });
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
