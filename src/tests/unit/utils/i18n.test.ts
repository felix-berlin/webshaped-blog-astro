import { useTranslations } from "@utils/i18n/utils";
import { test, expect, describe } from "vitest";

describe("useTranslations i18n", () => {
  test("translation string", () => {
    const locale = "de_DE";
    const t = useTranslations(locale);
    const translationString = "comment_label";
    const expected = "Schreibe einen Kommentar:";

    const result = t(translationString);

    expect(result).toBe(expected);
  });

  test("replaces variables", () => {
    const locale = "en_US";
    const t = useTranslations(locale);
    const translationString = "scrobble_display.album_cover.alt";
    const varsToReplace = { album: "Album", artist: "Artist" };
    const expected = "Album cover of Album von Artist";

    const result = t(translationString, varsToReplace);

    expect(result).toBe(expected);
  });

  test("plural forms", () => {
    const locale = "de_DE";
    const t = useTranslations(locale);
    const translationString = "reading_time.text--plural";
    const expected = "5 Minuten";

    const result = t(translationString, { minutes: 5 }, 5);

    expect(result).toBe(expected);
  });

  test("replaces null variable with empty string via ?? operator (covers line 75)", () => {
    const locale = "en_US";
    const t = useTranslations(locale);
    // album is null → varsToReplace["album"] = null → null ?? "" = ""
    const result = t("scrobble_display.album_cover.alt", { album: null as any, artist: "TestArtist" });
    expect(result).toContain("TestArtist");
    expect(result).not.toContain("null");
  });
});
