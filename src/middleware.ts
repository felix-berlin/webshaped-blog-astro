import { notFound, redirectToDefaultLocale, requestHasLocale } from "astro:i18n";
import { defineMiddleware } from "astro:middleware";

// Top-level segments that are real, non-locale routes and must never be
// treated as a locale attempt, even though they don't carry a file extension.
// - "api"      -> src/pages/api/**
// - "404"      -> src/pages/404.astro
// - "category" -> legacy top-level redirect in astro.config.mjs
//                 ("/category/web-analytics" -> "/de/category/matomo/1")
// - "_image"   -> Astro's built-in image-optimization endpoint (astro:assets'
//                 <Image>/<Picture> components request it as e.g.
//                 "/_image?href=...&f=webp" — the format lives in the query
//                 string, not the path, so it never carries a file
//                 extension and was being 404'd by this middleware).
const NON_LOCALE_TOP_LEVEL_SEGMENTS = new Set(["404", "_image", "api", "category"]);

// A path is "locale-shaped" (must resolve to a configured locale or 404)
// unless its first segment is an explicitly allowlisted non-locale route, or
// its last segment carries a file extension (build output under /_astro/,
// pagefind's index under /pagefind/, files under /assets/, and top-level
// static files like /robots.txt or /sitemap-index.xml all have one).
export const isLocaleShapedPath = (pathname: string): boolean => {
  const segments = pathname.split("/").filter(Boolean);
  const [firstSegment] = segments;
  if (!firstSegment) return false;
  if (NON_LOCALE_TOP_LEVEL_SEGMENTS.has(firstSegment)) return false;

  const lastSegment = segments[segments.length - 1];
  return !lastSegment.includes(".");
};

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  if (pathname === "/") {
    return redirectToDefaultLocale(context, 302);
  }

  if (isLocaleShapedPath(pathname) && !requestHasLocale(context)) {
    return notFound(context);
  }

  return next();
});
