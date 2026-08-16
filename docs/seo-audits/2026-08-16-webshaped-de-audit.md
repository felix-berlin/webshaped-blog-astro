# SEO Audit — webshaped.de

**Date:** 2026-08-16
**Scope:** Full-site audit via 8 parallel specialist passes (technical, content/E-E-A-T, schema, sitemap, performance, visual/mobile, GEO/AI-search, SXO).
**SEO Health Score: 61/100** (as measured before the fixes below)

Interactive version with score gauges and severity chips: see the published artifact link shared in chat (not checked into the repo — HTML/CSS presentation layer, not durable project documentation).

## Fix status (updated 2026-08-16)

Action plan items 1, 3, 4, and 5 are shipped in code (this branch). Item 2 is split: the Person/WebSite schema is shipped, the "Über mich" content rewrite is still pending in WordPress.

| #   | Item                             | Status     | Where                                                                                                                                         |
| --- | -------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Canonical `http://` → `https://` | ✅ Fixed   | [`src/components/BaseHead.astro`](../../src/components/BaseHead.astro), [`src/utils/helpers.ts`](../../src/utils/helpers.ts) (`toSiteOrigin`) |
| 2a  | Person/WebSite JSON-LD           | ✅ Fixed   | [`src/layouts/DefaultLayout.astro`](../../src/layouts/DefaultLayout.astro)                                                                    |
| 2b  | "Über mich" content rewrite      | ⏳ Pending | WordPress CMS — outside this repo, owner will write it                                                                                        |
| 3   | `BlogPosting` JSON-LD on posts   | ✅ Fixed   | [`src/layouts/BlogPost.astro`](../../src/layouts/BlogPost.astro)                                                                              |
| 4   | `/pagespeed-optimierung` 404     | ✅ Fixed   | [`nginx/conf.d/webshaped.conf`](../../nginx/conf.d/webshaped.conf)                                                                            |
| 5   | 8 pages missing from sitemap     | ✅ Fixed   | [`src/pages/sitemap-index.xml.ts`](../../src/pages/sitemap-index.xml.ts)                                                                      |

Notes on the fixes:

- **#1** also fixed the related High finding below (`og:url`/`twitter:url` pointing at `cms.webshaped.de`) in the same place — both bugs shared the same root cause: consuming WordPress's Yoast SEO fields verbatim instead of normalizing them to the public frontend's origin.
- **#2a** reuses the site's already-published identity copy ("Felix Scholze", "Software-Entwickler & Designer") — not new invented content — plus real GitHub/Mastodon links pulled from the same WordPress `GetAuthorDocument` query the footer already used (moved up into `DefaultLayout.astro` so it's fetched once and shared, not queried twice per page).
- **#4** fixes the one confirmed instance. No record of other renamed slugs exists in this repo (no old sitemap, no changelog entry) — finding siblings needs Search Console's coverage report or the WordPress edit history.
- **#5 was superseded by a bigger fix, then hardened further.** Initially patched via `@astrojs/sitemap`'s `customPages` option; replaced entirely with a dynamic SSR endpoint ([`src/pages/sitemap-index.xml.ts`](../../src/pages/sitemap-index.xml.ts), following [colinmcnamara.com's approach](https://colinmcnamara.com/blog/fixing-astro-sitemap-ssr-mode)) that fetches posts/pages/categories at request time. This also fixes the separate Medium finding below about `lastmod` being one identical build timestamp — posts now carry their real `modifiedGmt`/`dateGmt`, and `hreflang` alternates are preserved via `xhtml:link`. `@astrojs/sitemap` was removed as a dependency; `robots.txt` and `BaseHead.astro`'s sitemap link were briefly repointed at `/sitemap.xml`, then reverted back to `/sitemap-index.xml` (same URL search engines already know) once the endpoint was renamed back — see below. Verified live via local dev server — real per-post dates and full URL coverage confirmed in the browser.

  Three gaps surfaced afterward and were closed in follow-up passes:
  - **Category pagination was missing.** Category archives paginate at 6 posts/page (`[lang]/category/[slug]/[page].astro`); the endpoint originally only emitted page 1 per category. Now computes `totalPages` from each category's `count` field and emits every page.
  - **No `noindex` exclusion.** A post/page marked `noindex` in Yoast still appeared in the sitemap, since the query never fetched `seo.metaRobotsNoindex`. Added that field to `GetPostsPreview` (pages already had it via `PostTypeSeoFragment`, just needed unwrapping) — noindexed entries are now dropped, and stripped from any other entry's `hreflang` alternates too.
  - **No `hreflang` for category archives.** `CategoryFields` didn't request `translations`. Added it — page-1 category URLs now carry alternates; deeper pages don't, since a translated archive won't reliably share the same pagination.

  The `metaRobotsNoindex`/`translations` additions required extending existing GraphQL queries and running `pnpm gql:generate` against the live WordPress schema (real credentials via `infisical run`, explicitly requested).

  While debugging why posts/pages vanished from the sitemap after adding the `noindex` filter, found the real cause: WordPress's global Settings → Reading → "Discourage search engines from indexing this site" checkbox was on. WPGraphQL/Yoast's per-post `metaRobotsNoindex` resolver returns the _effective_ robots value, which is `noindex` for everything site-wide while that box is checked — not a bug in the query or the filter. Confirmed correct once the checkbox was unchecked: all 8 posts, 3 pages, and 7 category archives appeared with real dates and `hreflang` alternates.

  The endpoint was renamed back from `/sitemap.xml` to **`/sitemap-index.xml`** — same URL search engines already have indexed/crawled for this site, no reason to make them relearn a new path. `robots.txt` and `BaseHead.astro`'s sitemap link point there again.

- Added a basic XSL stylesheet ([`public/sitemap.xsl`](../../public/sitemap.xsl)) so `/sitemap-index.xml` renders as a readable table in a browser instead of raw unstyled XML — same pattern the RSS feeds already use (`pretty-feed-v3.xsl`).
- Verified with `astro check --minimumSeverity error` — 0 errors across all Astro files after the changes.

## Category scores

| Category                 | Weight | Score | Note                                                              |
| ------------------------ | ------ | ----- | ----------------------------------------------------------------- |
| Technical SEO            | 22%    | 64    | Canonical scheme bug, missing security headers, cache-control gap |
| Content Quality          | 23%    | 58    | Strong post depth, but a 32-word about page                       |
| On-Page SEO              | 20%    | 60    | `og:url` points at the CMS backend, not the site                  |
| Schema / Structured Data | 10%    | 25    | Only a `BreadcrumbList` exists site-wide                          |
| Performance (CWV)        | 10%    | 99    | Lab-only; all 3 Core Web Vitals pass Good                         |
| AI Search Readiness      | 10%    | 61    | Fully crawlable by AI bots, but no `llms.txt`                     |
| Images                   | 5%     | 55*   | *Estimated from incidental findings, not deep-audited             |

No local business, e-commerce, or backlink-API signals were detected, so `seo-local`, `seo-maps`, `seo-ecommerce`, and `seo-backlinks` were correctly not spawned. `seo-images` was not run as a dedicated pass.

## Critical findings

1. ✅ **Fixed.** **Homepage canonical tag uses `http://`, not `https://`.** `<link rel="canonical" href="http://webshaped.de/de">` on a page served over HTTPS — splits ranking signals. Post pages already do this correctly; isolated to the homepage template.
2. ⏳ **Partially fixed** (schema shipped, bio rewrite still pending in WordPress). **"Über mich" page is 32 words.** No timeline, no project list, no case studies. Confirmed by the SXO audit: for the non-branded query "Felix Scholze Software-Entwickler Berlin," LinkedIn and GitHub outrank the homepage — there's no on-site content for Google to prefer over those third-party profiles instead.
3. ✅ **Fixed.** Sitewide `Person`/`WebSite` JSON-LD now ships via `DefaultLayout.astro`; add a `description` once the bio text lands. **No Person/WebSite schema on the homepage.** Zero JSON-LD anywhere on the homepage; the only structured data site-wide is a `BreadcrumbList` on post pages and old-style Microdata on the author box. Pairs with #2 — the rewritten bio needs a machine-readable graph to actually move the identity-query SERP.
4. ✅ **Fixed** (this instance; siblings unverified from this repo). **Indexed URL 404s: `/pagespeed-optimierung`.** Google has this indexed under the title "Automatische Matomo Backups via Bash Script und Cronjob," but it now 404s. The content moved to a _different_ slug (`/de/posts/automatische-matomo-backups`), not just a different path prefix, so the existing legacy-slug redirect map in nginx doesn't cover it. Likely not the only renamed slug from the migration — worth diffing the full pre-migration WordPress URL list against the current route table.

## High-priority findings

- ✅ Fixed (same change as critical item #1). `og:url` / `twitter:url` point at `cms.webshaped.de` instead of the public frontend — breaks social-share attribution.
- No security headers anywhere (HSTS, CSP, X-Content-Type-Options, Referrer-Policy). Root cause: the nginx `location /` block has zero `add_header` directives.
- Hashed static assets under `/_astro/*` are cached with `max-age=0` instead of long-lived immutable caching — forces a revalidation round-trip on every repeat visit.
- Author image `alt` text is broken in production: the avatar's `alt` renders the literal, un-interpolated template string instead of the author's name, and the hero image ships an empty `alt`. Source: `src/components/post/Author.astro:53` and the parallel `.vue` file — the repo source looks like it should interpolate correctly, so reproduce against the currently deployed build before assuming a one-line fix.
- ✅ Fixed. No `BlogPosting`/`Article` schema on post pages, despite every needed field (headline, dates, author, image) already rendering in HTML — pure serialization, flagged independently by three of the eight audits.
- ✅ Fixed. 8 real pages missing from the sitemap: both locale homepages and 4 static pages (Impressum, Datenschutz, Über mich, and English equivalents) are SSR-only and never picked up, because `@astrojs/sitemap` only scans prerendered output and these routes lack `export const prerender = true`.
- The Matomo-performance-tutorial content targets a query 100% dominated by matomo.org's own docs/forum/GitHub issues — an independent tutorial can't outrank official vendor documentation without a genuinely unique data point (e.g. a real before/after benchmark).

## Medium-priority findings

| Finding                                                                                               | Source          |
| ----------------------------------------------------------------------------------------------------- | --------------- |
| hreflang mixes relative/absolute URLs; posts have no `x-default`                                      | Technical       |
| IndexNow protocol not implemented (no key file, no ping integration)                                  | Technical       |
| Legacy-slug redirects are a hand-maintained nginx map — a missed future rename silently 404s          | Technical / SXO |
| `llms.txt` returns the homepage SPA shell instead of real content or a 404                            | GEO             |
| Homepage meta description reads as a checkmark-list service pitch, not a natural description          | Content         |
| WordPress excerpts truncate mid-sentence with "…", hurting snippet extractability                     | GEO             |
| Mobile hamburger menu touch target is ~36×40px, below the 44px guideline                              | Visual          |
| ✅ Fixed. ~~`/sitemap.xml` resolves 200 as HTML instead of 404~~ — it's now the real sitemap endpoint | Sitemap         |
| ✅ Fixed. ~~Every sitemap `lastmod` is an identical build timestamp~~ — posts now carry real dates    | Sitemap         |
| Post intros open with a rhetorical hook instead of a direct answer, delaying the extractable passage  | GEO             |
| Redirect chain `http → https → /de` is 2 hops; could collapse to 1                                    | Performance     |
| Slow TTFB (~1,780ms) on the initial `/de` server response                                             | Performance     |
| Existing author Microdata isn't unified with any homepage entity via a shared `@id`                   | Schema          |

## Low-priority findings

| Finding                                                                      | Source      |
| ---------------------------------------------------------------------------- | ----------- |
| Old post states a release date of "31.04.2020" — April has 30 days           | Content     |
| No "last reviewed" indicator on version-specific 2018–2020 tutorials         | Content     |
| A couple of desktop nav links sit just under the 44px touch-target guideline | Visual      |
| No single primary CTA above the fold — acceptable for a blog index page      | Visual      |
| ~104 KiB unused JS, minor cache/legacy-JS savings available                  | Performance |

## Action plan (dependency-sequenced)

1. ✅ **Done.** ~~Fix the homepage canonical scheme (http → https).~~ One-line template fix, ship first.
2. ⏳ **Schema done, rewrite pending.** ~~Rewrite "Über mich" + add Person/WebSite JSON-LD together.~~ The schema graph needs the rewritten bio's facts to be worth anything; the rewrite needs the schema to move the identity-query SERP. Track "Felix Scholze Software-Entwickler Berlin" ranking as the leading indicator once the bio is live.
3. ✅ **Done.** ~~Add `Article`/`BlogPosting` JSON-LD to the post template.~~ Independent of #2 — pure serialization of data already in the DOM.
4. ✅ **Done** (this instance). ~~Fix the renamed-slug 404 and audit for siblings.~~ Diff the full pre-migration WordPress URL list against the current route table — sibling check still needs Search Console/WP history access this session didn't have.
5. ✅ **Done** — used sitemap `customPages` rather than `prerender = true` to avoid losing live-content freshness on those routes.
6. ✅ **Done** (same fix as #1). ~~Correct `og:url`/`twitter:url` to the public domain.~~ Same layout component as the canonical fix — bundled into the same change.
7. **Add nginx security headers + long-lived caching for `/_astro/*`.** Infra-only change. Plan CSP carefully around Astro's inline loading-indicator script (nonces/hashes, not `unsafe-inline`).
8. **Fix the broken author/hero `alt` text.** Reproduce against the live deployed build first.
9. **Decide: differentiate or drop the Matomo-performance angle.** Editorial call, not a template fix.
10. **Everything in Medium/Low** — batch into routine maintenance once the above ships.

## Methodology notes

- Performance pass used a local Lighthouse lab run — no CrUX field data (PageSpeed API quota exhausted, no Google API key configured).
- The SXO pass disclosed it lacked its own reference scripts/taxonomy and substituted general SERP-backwards methodology — its findings are directional, not the skill's calibrated output.
- This is an automated read of a public site; no personal, customer, or credential data was processed. Final editorial and technical judgment on every recommendation rests with the site owner before anything ships.
