// Mirrors the breakpoint range Astro's own `layout="constrained"` generates
// for a similarly-sized image, for parity between the Astro Picture path
// and this client-side (Vue) one.
export const RESPONSIVE_WIDTHS = [640, 750, 828, 960, 1080, 1280, 1600];

/**
 * Builds a src for client-hydrated (`client:only`) components, which can't
 * reach IMAGOR_SECRET (astro:env/server). Redirects through /api/imagor,
 * which does the signing server-side.
 */
export function imagorSrc(src: string, width: number, height: number, format?: string): string {
  const params = new URLSearchParams({ h: String(height), src, w: String(width) });
  if (format) params.set("format", format);
  return `/api/imagor?${params.toString()}`;
}
