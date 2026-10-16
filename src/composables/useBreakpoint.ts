import { useMediaQuery } from "@vueuse/core";

/** Mirrors `$custom-breakpoints` in src/styles/variables/_layout.scss (in px). */
export const BREAKPOINTS = { md: 1025, sm: 769 } as const;

/** True below a SCSS breakpoint, i.e. exactly where its `min-width` styles don't apply. */
export const useBelowBreakpoint = (name: keyof typeof BREAKPOINTS) =>
  useMediaQuery(`not all and (min-width: ${BREAKPOINTS[name] / 16}rem)`);
