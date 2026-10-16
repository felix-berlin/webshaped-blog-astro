/** Posts per prerendered category archive page — the sitemap derives its page count from it too. */
export const CATEGORY_PAGE_SIZE = 6;

export const PRIVACY_PAGE_SLUG = "datenschutz";

/** "ueber-mich" renders the developer card with live GitHub stats instead of WP content. */
export const ABOUT_PAGE_SLUG = "ueber-mich";

/** German canonical slugs of the WP pages served by `src/pages/[lang]/[pageSlug].astro`. */
export const STATIC_PAGE_SLUGS = [PRIVACY_PAGE_SLUG, "impressum", ABOUT_PAGE_SLUG];
