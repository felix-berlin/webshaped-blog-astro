import { BREAKPOINTS, useBelowBreakpoint } from "@composables/useBreakpoint";
import { useMediaQuery } from "@vueuse/core";
import { describe, expect, it, vi } from "vitest";

vi.mock("@vueuse/core", () => ({ useMediaQuery: vi.fn() }));

describe("useBelowBreakpoint()", () => {
  it.each(Object.entries(BREAKPOINTS))(
    "queries the inverse of the %s min-width breakpoint in rem",
    (name, px) => {
      useBelowBreakpoint(name as keyof typeof BREAKPOINTS);

      expect(useMediaQuery).toHaveBeenLastCalledWith(`not all and (min-width: ${px / 16}rem)`);
    },
  );
});
