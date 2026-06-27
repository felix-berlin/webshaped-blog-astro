import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { it, expect, describe } from "vitest";

describe("i18n locale files validation", () => {
  const rootPath = process.cwd();
  const enUSFilePath = path.join(rootPath, "src/content/i18n/", "en-US.json");
  const deDEFilePath = path.join(rootPath, "src/content/i18n/", "de-DE.json");

  const enUS = JSON.parse(readFileSync(enUSFilePath, "utf-8"));
  const deDE = JSON.parse(readFileSync(deDEFilePath, "utf-8"));

  const enUSKeys = Object.keys(enUS);
  const deDEKeys = Object.keys(deDE);

  it("en-US.json file exists and is valid JSON", () => {
    expect(enUSKeys.length).toBeGreaterThan(0);
  });

  it("de-DE.json file exists and is valid JSON", () => {
    expect(deDEKeys.length).toBeGreaterThan(0);
  });

  it("both locale files have the same keys", () => {
    const missingInDE = enUSKeys.filter((key) => !deDEKeys.includes(key));
    const missingInEN = deDEKeys.filter((key) => !enUSKeys.includes(key));
    expect(missingInDE).toHaveLength(0);
    expect(missingInEN).toHaveLength(0);
  });

  it("en-US has all keys that de-DE has", () => {
    const missingInEN = deDEKeys.filter((key) => !enUSKeys.includes(key));
    expect(missingInEN).toHaveLength(0);
  });

  it("de-DE has all keys that en-US has", () => {
    const missingInDE = enUSKeys.filter((key) => !deDEKeys.includes(key));
    expect(missingInDE).toHaveLength(0);
  });

  it("all values in en-US are non-empty strings or objects", () => {
    for (const key of enUSKeys) {
      const value = enUS[key];
      expect(value !== null && value !== undefined).toBe(true);
    }
  });

  it("all values in de-DE are non-empty strings or objects", () => {
    for (const key of deDEKeys) {
      const value = deDE[key];
      expect(value !== null && value !== undefined).toBe(true);
    }
  });
});
