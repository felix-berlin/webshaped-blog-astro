import { defineMiddleware } from "astro:middleware";
import { notFound, redirectToDefaultLocale, requestHasLocale } from "astro:i18n";

// Only paths that look like a locale attempt (exactly two lowercase letters
// as the first segment) are treated as "must resolve to a configured
// locale or 404". Every other path (/api/*, /404, /sitemap-index.xml,
// /robots.txt, static assets) is left alone — none of them are 2 lowercase
// letters, so this can't shadow them.
export const isLocaleShapedPath = (pathname: string): boolean => /^\/[a-z]{2}(\/|$)/.test(pathname);

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
