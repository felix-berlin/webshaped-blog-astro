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

// Pre-migration WordPress post URLs (top-level slug) -> current post slug.
// Matched on the first path segment only, so "/slug", "/slug/" and
// "/slug/anything" all redirect; the rest of the path is dropped, the query
// string is kept. Must run before the locale 404 below.
const LEGACY_POST_SLUGS: Record<string, string> = {
  "automatische-matomo-backups": "automatische-matomo-backups",
  "code-dokumentieren-leicht-gemacht-vs-code-extension-guide":
    "code-dokumentieren-leicht-gemacht-vs-code-extension-guide",
  "datenschutz-checkbox-fuer-wordpress-kommentare-ohne-plugin":
    "datenschutz-checkbox-fuer-wordpress-kommentare-ohne-plugin",
  "gutenberg-standard-vollbildmodus-deaktivieren-wordpress-5-4":
    "gutenberg-standard-vollbildmodus-deaktivieren-wordpress-5-4",
  "matomo-tracking-script-optimal-einbinden": "matomo-tracking-script-optimal-einbinden",
  // Pre-rename WordPress slug for this post, still indexed by Google under
  // the title "Automatische Matomo Backups via Bash Script und Cronjob" —
  // confirmed 404ing before this entry was added (2026-08-16 SEO audit).
  // Intentionally maps to a *different* slug than the key, not a
  // copy-paste error: the post itself was renamed during migration.
  "pagespeed-optimierung": "automatische-matomo-backups",
  "stockfoto-sammlung": "stockfoto-sammlung",
  "wordpress-comment-form-validation-interaktiv-mit-javascript":
    "wordpress-comment-form-validation-interaktiv-mit-javascript",
};

export const legacyRedirectTarget = (url: URL): string | undefined => {
  const firstSegment = url.pathname.split("/")[1];
  const slug = Object.hasOwn(LEGACY_POST_SLUGS, firstSegment)
    ? LEGACY_POST_SLUGS[firstSegment]
    : undefined;
  return slug && `/de/posts/${slug}${url.search}`;
};

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  const legacyTarget = legacyRedirectTarget(context.url);
  if (legacyTarget) {
    return context.redirect(legacyTarget, 301);
  }

  if (pathname === "/") {
    return redirectToDefaultLocale(context, 302);
  }

  if (isLocaleShapedPath(pathname) && !requestHasLocale(context)) {
    return notFound(context);
  }

  return next();
});
