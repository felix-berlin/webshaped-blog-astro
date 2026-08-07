// @ts-ignore: Unresolved import
import { resolveMenuId } from "@utils/helpers";
import { it, expect, describe, vi } from "vitest";

describe("resolveMenuId()", () => {
  it("resolves the menu ID for a supported language", () => {
    expect(resolveMenuId("de")).toBe("2");
    expect(resolveMenuId("en")).toBe("125");
  });

  it("returns undefined and logs for an unsupported language", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(resolveMenuId("fr")).toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('unsupported lang "fr"'));
  });
});
