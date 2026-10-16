import { BREAKPOINTS, useBelowBreakpoint } from "@composables/useBreakpoint";
import { useMediaQuery } from "@vueuse/core";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

vi.mock("@vueuse/core", () => ({ useMediaQuery: vi.fn() }));

describe("BREAKPOINTS", () => {
  // The JS copy is hand-maintained; this catches it drifting from the SCSS source.
  it.each(Object.entries(BREAKPOINTS))("matches $%s in _layout.scss", (name, px) => {
    const scss = readFileSync("src/styles/variables/_layout.scss", "utf-8");
    expect(scss).toMatch(new RegExp(`^\\$${name}: butler-fn\\.px-to-rem\\(${px}\\);`, "m"));
  });
});

describe("useBelowBreakpoint()", () => {
  it.each(Object.entries(BREAKPOINTS))(
    "queries the inverse of the %s min-width breakpoint in rem",
    (name, px) => {
      useBelowBreakpoint(name as keyof typeof BREAKPOINTS);

      expect(useMediaQuery).toHaveBeenLastCalledWith(`not all and (min-width: ${px / 16}rem)`);
    },
  );
});
