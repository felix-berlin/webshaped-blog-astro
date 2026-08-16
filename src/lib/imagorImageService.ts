import type { ExternalImageService, ImageTransform } from "astro";

import { buildImagorPath, signImagorPath } from "@utils/imagor";
import { baseService } from "astro/assets";

type ImagorImageTransform = ImageTransform & {
  densities?: Array<number | string>;
  filters?: Astro.ImagorProcessingFilter[];
};

type UnresolvedSrcSetValue = {
  attributes?: Record<string, unknown>;
  descriptor?: string;
  transform: ImageTransform;
};

function getImagorURLForTransform(options: ImagorImageTransform): string {
  if (typeof options.src !== "string") {
    // Local (ESM-imported) images are served at their original, Vite-processed
    // asset URL — Imagor only transforms remote CMS/Wikimedia/Amazon images.
    return options.src.src;
  }
  if (!options.width || !options.height) {
    throw new Error(`imagorImageService requires both width and height, got src=${options.src}`);
  }

  const path = buildImagorPath(options.src, {
    filters: options.filters,
    format: options.format,
    height: options.height,
    quality: typeof options.quality === "number" ? options.quality : undefined,
    width: options.width,
  });

  return signImagorPath(path);
}

const imagorImageService: ExternalImageService = {
  getHTMLAttributes: baseService.getHTMLAttributes,
  getSrcSet(options: ImagorImageTransform): UnresolvedSrcSetValue[] {
    if (typeof options.src !== "string") {
      return [];
    }

    // Astro's <Picture> calls getImage/getSrcSet once per entry in its own
    // `formats` prop, each time with a single `options.format` already set —
    // it does its own format loop upstream, so this service must not loop
    // over formats itself (that previously produced one <source> per format
    // but stripped every format's own base-width candidate from its srcset).
    const baseWidth = options.width ?? 1;
    const baseHeight = options.height ?? 1;
    const aspectRatio = baseWidth / baseHeight;

    // `widths` (from Astro's `layout`/responsive-image breakpoints) and `densities`
    // are mutually exclusive on ImageTransform — mirror astro's own baseService here.
    const sizes =
      options.widths && options.widths.length > 0
        ? options.widths.map((width) => ({
            descriptor: `${width}w`,
            height: Math.max(1, Math.round(width / aspectRatio)),
            width,
          }))
        : (options.densities && options.densities.length > 0 ? options.densities : [1]).map(
            (density) => {
              const numericDensity = Number(density);
              return {
                descriptor: `${numericDensity}x`,
                height: Math.max(1, Math.round(baseHeight * numericDensity)),
                width: Math.max(1, Math.round(baseWidth * numericDensity)),
              };
            },
          );

    return sizes.map(({ descriptor, height, width }) => ({
      descriptor,
      transform: { ...options, height, width },
    }));
  },
  getURL(options: ImagorImageTransform) {
    return getImagorURLForTransform(options);
  },
  validateOptions: baseService.validateOptions,
};

export default imagorImageService;
