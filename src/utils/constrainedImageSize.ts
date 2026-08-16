import { captureException } from "@sentry/astro";

const FALLBACK_HEIGHT = 400;

/**
 * `layout="constrained"` (and its imagor/Vue equivalent) wants the intended
 * render width, not the raw WP pixel size — height is derived from the real
 * WP aspect ratio so images aren't distorted. When WordPress doesn't return
 * usable media dimensions, falls back to a fixed height and warns, since a
 * silently wrong aspect ratio otherwise only shows up as a stretched image.
 */
export function computeConstrainedSize(
  width: number,
  rawWidth: null | number | undefined,
  rawHeight: null | number | undefined,
  context: string,
): { height: number; width: number } {
  const numericWidth = Number(rawWidth) || 0;
  const numericHeight = Number(rawHeight) || 0;

  if (!numericWidth || !numericHeight) {
    const message = `${context}: missing WordPress media dimensions, falling back to a ${FALLBACK_HEIGHT}px height`;
    console.warn(message);
    captureException(new Error(message));
    return { height: FALLBACK_HEIGHT, width };
  }

  return { height: Math.round(width * (numericHeight / numericWidth)), width };
}
