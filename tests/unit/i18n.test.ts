import { test, expect } from "vitest";
import { __ } from "@i18n/i18n";

describe("__ i18n", () => {
  test("translation string", () => {
    const locale = "de_DE";
    const translationString = "comment_label";
    const expected = "Schreibe einen Kommentar:";

    const result = __(locale, translationString);

    expect(result).toBe(expected);
  });

  test("replaces variables", () => {
    const locale = "en_US";
    const translationString = "scrobble_display.album_cover.alt";
    const varsToReplace = { album: "Album", artist: "Artist" };
    const expected = "Album cover of Album von Artist";

    const result = __(locale, translationString, varsToReplace);

    expect(result).toBe(expected);
  });

  test("plural forms", () => {
    const locale = "de_DE";
    const translationString = "reading_time.text--plural";
    const expected = "5 Minuten";

    const result = __(locale, translationString, { minutes: 5 }, 5);

    expect(result).toBe(expected);
  });
});
