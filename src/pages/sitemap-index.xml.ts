import type { APIContext } from "astro";

import { CategoryFields } from "@services/queries/getCategory";
import { pageVariants } from "@services/queries/getPage";
import { wpQueryChrome } from "@services/wpGraphqlClient";
import { toIsoUtc } from "@utils/helpers";
import { defaultLang, LOCALES } from "@utils/i18n/ui";
import {
  buildTranslationRoutes,
  categoryPathBuilder,
  pagePathBuilder,
  postPathBuilder,
  type TranslationEntry,
  toLanguageCode,
} from "@utils/i18n/utils";
import { CATEGORY_PAGE_SIZE, STATIC_PAGE_SLUGS } from "@utils/routes";

import { useFragment } from "@/gql";
import {
  GetAllCategoriesDocument,
  GetPagesBySlugsDocument,
  GetPostsPreviewDocument,
} from "@/gql/graphql.ts";

interface Alternate {
  href: string;
  hreflang: string;
}

interface SitemapUrl {
  alternates?: Alternate[];
  lastmod?: string;
  loc: string;
}

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const isNoindex = (value: null | string | undefined) => (value ?? "").toLowerCase() === "noindex";

// Drops noindexed entries, then strips any alternate that itself points at
// a noindexed URL — a noindexed translation shouldn't survive as another
// page's hreflang alternate either.
const dropNoindexed = <T extends { alternates?: Alternate[]; loc: string; noindex: boolean }>(
  entries: T[],
): SitemapUrl[] => {
  const noindexedLocs = new Set(entries.filter((entry) => entry.noindex).map((entry) => entry.loc));

  return entries
    .filter((entry) => !entry.noindex)
    .map(({ alternates, lastmod, loc }: T & { lastmod?: string }) => ({
      alternates: alternates?.filter((alternate) => !noindexedLocs.has(alternate.href)),
      lastmod,
      loc,
    }));
};

const renderUrl = ({ alternates, lastmod, loc }: SitemapUrl) => {
  const alternateLinks = (alternates ?? [])
    .map(
      ({ href, hreflang }) =>
        `<xhtml:link href="${escapeXml(href)}" hreflang="${hreflang}" rel="alternate" />`,
    )
    .join("");

  return `<url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}${alternateLinks}</url>`;
};

export const GET = async ({ site }: APIContext) => {
  const url = (path: string) => new URL(path, site).toString();
  const toAlternates = (entries: TranslationEntry[]): Alternate[] =>
    Object.entries(buildTranslationRoutes(entries)).map(([hreflang, path]) => ({
      href: url(path),
      hreflang,
    }));

  // Each section degrades to empty on failure (logged + reported to Sentry by
  // wpQueryChrome) — a broken categories query shouldn't also drop posts and
  // pages that fetched fine.
  const [postsResponse, categoriesResponse, pagesResponse] = await Promise.all([
    wpQueryChrome(GetPostsPreviewDocument, { languages: LOCALES.map(toLanguageCode) }),
    wpQueryChrome(GetAllCategoriesDocument, {}),
    wpQueryChrome(GetPagesBySlugsDocument, { slugs: STATIC_PAGE_SLUGS, withContent: false }),
  ]);

  const homeAlternates = [
    ...toAlternates(LOCALES.map((lang) => [lang, `/${lang}`])),
    { href: url(`/${defaultLang}`), hreflang: "x-default" },
  ];
  const homeUrls: SitemapUrl[] = LOCALES.map((lang) => ({
    alternates: homeAlternates,
    loc: url(`/${lang}`),
  }));

  const postEntries = (postsResponse?.posts?.nodes ?? []).flatMap((post) => {
    const lang = post.language?.slug;
    if (!lang || !post.slug) return [];

    return [
      {
        alternates: toAlternates(
          [post, ...(post.translations ?? [])].map((variant) => [
            variant?.language?.slug,
            variant?.slug && postPathBuilder(variant.slug, variant.language?.slug ?? ""),
          ]),
        ),
        lastmod: toIsoUtc(post.modifiedGmt) ?? toIsoUtc(post.dateGmt),
        loc: url(postPathBuilder(post.slug, lang)),
        noindex: isNoindex(post.seo?.metaRobotsNoindex),
      },
    ];
  });
  const postUrls = dropNoindexed(postEntries);

  // Emit one entry per language variant (self + translations), each carrying
  // the full alternate set — matching the post branch below. Emitting only
  // the German page here previously left the English legal/about pages out
  // of the sitemap entirely and made hreflang non-reciprocal (Google expects
  // every language variant to have its own <url> entry with the same
  // alternate list).
  const pageEntries = (pagesResponse?.pages?.nodes ?? []).flatMap((rawPage) => {
    const variants = pageVariants(rawPage).flatMap((variant) => {
      const lang = variant.language?.slug;
      if (!lang || !variant.slug) return [];

      return [
        {
          href: url(pagePathBuilder(variant.slug, lang)),
          hreflang: lang,
          noindex: isNoindex(variant.seo?.metaRobotsNoindex),
        },
      ];
    });

    const alternates = variants.map(({ href, hreflang }) => ({ href, hreflang }));

    // No lastmod: PageFieldFragment doesn't request modifiedGmt, and these
    // legal/about pages change rarely enough that omitting it (valid per
    // the sitemap spec) beats faking a date.
    return variants.map(({ href, noindex }) => ({ alternates, loc: href, noindex }));
  });
  const pageUrls = dropNoindexed(pageEntries);

  // WPGraphQL's root `categories` connection already returns every term
  // flat — children included as their own `nodes` entries (confirmed by
  // MainFooter.astro rendering the same connection with no children
  // traversal). Walking `children`/`children.children` on top of that
  // duplicated every child category 2-3x in the sitemap.
  // Category archives beyond CATEGORY_PAGE_SIZE posts split into additional
  // prerendered (and therefore crawlable) pages.
  const categoryUrls: SitemapUrl[] = (categoriesResponse?.categories?.nodes ?? []).flatMap(
    (rawCategory) => {
      const category = useFragment(CategoryFields, rawCategory);
      const lang = category.language?.slug;
      const slug = category.slug;
      if (!lang || !slug) return [];

      const totalPages = Math.max(1, Math.ceil((category.count ?? 0) / CATEGORY_PAGE_SIZE));

      // hreflang alternates only make sense for page 1 — a translated
      // category archive won't reliably have the same post count, so its
      // own pagination doesn't line up page-for-page with this one.
      const firstPageAlternates = toAlternates(
        [category, ...(category.translations ?? [])].map((variant) => [
          variant?.language?.slug,
          variant?.slug && categoryPathBuilder(variant.slug, variant.language?.slug ?? ""),
        ]),
      );

      return Array.from({ length: totalPages }, (_, index) => ({
        alternates: index === 0 ? firstPageAlternates : undefined,
        loc: url(categoryPathBuilder(slug, lang, String(index + 1))),
      }));
    },
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...homeUrls, ...pageUrls, ...postUrls, ...categoryUrls].map(renderUrl).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=1800",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
