import { test, expect, describe } from "vitest";
import { useTranslations } from "@utils/i18n/utils";

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
});
