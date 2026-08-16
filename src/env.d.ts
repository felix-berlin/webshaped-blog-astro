import "../.astro/types.d.ts";
import "astro/client";
import "../.astro/astro-env.d.ts";
declare module "@pagefind/default-ui";
declare module "*.gql";
declare module "*.graphql";

declare global {
  namespace Astro {
    interface ImagorAlignConfig {
      horizontal?: ImagorHorizontalAlign;
      vertical?: ImagorVerticalAlign;
    }

    type ImagorEndpointMode = "adaptive-fit-in" | "fit-in" | "full-fit-in" | "stretch" | "trim";
    type ImagorHorizontalAlign = "center" | "left" | "right";

    interface ImagorPaddingConfig {
      bottom?: number;
      left?: number;
      right?: number;
      top?: number;
    }

    /**
     * Imagor processing filter strings, chained in the order given.
     * See https://docs.imagor.net/filters
     */
    type ImagorProcessingFilter =
      | `blur(${number})`
      | `brightness(${number})`
      | `contrast(${number})`
      | `format(${"avif" | "gif" | "jp2" | "jpeg" | "jxl" | "png" | "tiff" | "webp"})`
      | `grayscale()`
      | `quality(${number})`
      | `rotate(${0 | 90 | 180 | 270})`
      | `saturation(${number})`
      | `sharpen(${number})`
      | `strip_exif()`
      | `strip_icc()`
      // `string & {}` (not bare `string`) keeps the literals above as
      // autocomplete suggestions — a plain `| string` member collapses the
      // whole union to `string` and silently discards all of them.
      | (string & {});

    type ImagorVerticalAlign = "bottom" | "middle" | "top";
  }
}

export {};
