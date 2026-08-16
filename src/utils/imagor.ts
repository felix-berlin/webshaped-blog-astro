import { IMAGOR_HOST, IMAGOR_SECRET } from "astro:env/server";
import { createHmac } from "node:crypto";

const SIGNER_TRUNCATE = 40;

interface ImagorTransform {
  align?: Astro.ImagorAlignConfig;
  filters?: Astro.ImagorProcessingFilter[];
  format?: string;
  height: number;
  mode?: Astro.ImagorEndpointMode;
  padding?: Astro.ImagorPaddingConfig;
  quality?: number;
  smart?: boolean;
  width: number;
}

export function buildImagorPath(
  upstreamUrl: string,
  {
    align,
    filters = [],
    format,
    height,
    mode = "fit-in",
    padding,
    quality,
    smart = false,
    width,
  }: ImagorTransform,
): string {
  const targetFormat = format ?? "webp";
  const targetQuality = quality ?? 80;
  const filterSuffix = filters.length > 0 ? `:${filters.join(":")}` : "";

  const alignmentPrefix = align
    ? `/${align.horizontal ?? "center"}/${align.vertical ?? "middle"}`
    : "";
  const paddingPrefix = normalizePadding(padding) ? `/${normalizePadding(padding)}` : "";
  const smartPrefix = smart ? "/smart" : "";

  return `${mode}/${width}x${height}${paddingPrefix}${alignmentPrefix}${smartPrefix}/filters:format(${targetFormat}):quality(${targetQuality})${filterSuffix}/${encodeURIComponent(upstreamUrl)}`;
}

export function signImagorPath(path: string): string {
  const host = IMAGOR_HOST.replace(/\/+$/, "");
  const hash = createHmac("sha256", IMAGOR_SECRET)
    .update(path)
    .digest("base64url")
    .slice(0, SIGNER_TRUNCATE);
  return `${host}/${hash}/${path}`;
}

function normalizePadding(padding?: Astro.ImagorPaddingConfig): string {
  if (!padding) {
    return "";
  }

  const left = padding.left ?? 0;
  const top = padding.top ?? 0;
  const right = padding.right ?? left;
  const bottom = padding.bottom ?? top;

  if (left === 0 && top === 0 && right === 0 && bottom === 0) {
    return "";
  }

  return `${left}x${top}:${right}x${bottom}`;
}
