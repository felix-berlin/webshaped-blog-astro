import type { APIContext } from "astro";

import { captureException } from "@sentry/astro";
import { PostTypeSeoFragment } from "@services/fragments/fragments";
import { CategoryFields } from "@services/queries/getCategory";
import { PageFieldFragment } from "@services/queries/getPage";
import { wpQuery } from "@services/wpGraphqlClient";
import { firstCategoryPage, removeLocaleCode } from "@utils/helpers";

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

// WPGraphQL's *Gmt fields serialize without a timezone suffix even though
// they're already UTC — append "Z" so they parse as valid ISO 8601 instants.
const toIsoUtc = (value: null | string | undefined) =>
  value && !value.endsWith("Z") ? `${value}Z` : (value ?? undefined);

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

// Fetches one sitemap section; on failure, logs + reports to Sentry and
// degrades to an empty section instead of taking the whole sitemap down —
// a broken categories query shouldn't also drop posts and pages that
// fetched fine.
const fetchSection = async <T>(name: string, query: () => Promise<T>, empty: T): Promise<T> => {
  try {
    return await query();
  } catch (error) {
    console.error(`sitemap-index.xml: "${name}" query failed, rendering without it: ${String(error)}`);
    captureException(error);
    return empty;
  }
};

export const GET = async ({ site }: APIContext) => {
  const url = (path: string) => new URL(path, site).toString();

  const [postsResponse, categoriesResponse, pagesResponse] = await Promise.all([
    fetchSection("posts", () => wpQuery(GetPostsPreviewDocument, { languages: ["DE", "EN"] }), {
      posts: null,
    }),
    fetchSection("categories", () => wpQuery(GetAllCategoriesDocument, {}), { categories: null }),
    fetchSection(
      "pages",
      () => wpQuery(GetPagesBySlugsDocument, { slugs: ["datenschutz", "impressum", "ueber-mich"] }),
      { pages: null },
    ),
  ]);

  const homeUrls: SitemapUrl[] = ["de", "en"].map((lang) => ({
    alternates: [
      { href: url("/de"), hreflang: "de" },
      { href: url("/en"), hreflang: "en" },
      { href: url("/de"), hreflang: "x-default" },
    ],
    loc: url(`/${lang}`),
  }));

  const postEntries = (postsResponse.posts?.nodes ?? []).flatMap((post) => {
    const lang = post.language?.slug;
    if (!lang || !post.slug) return [];

    const selfAlternate = { href: url(`/${lang}/posts/${post.slug}`), hreflang: lang };
    const translationAlternates = (post.translations ?? []).flatMap((translation) => {
      const translationLang = translation?.language?.slug;
      if (!translationLang || !translation?.slug) return [];
      return [
        { href: url(`/${translationLang}/posts/${translation.slug}`), hreflang: translationLang },
      ];
    });

    return [
      {
        alternates: [selfAlternate, ...translationAlternates],
        lastmod: toIsoUtc(post.modifiedGmt) ?? toIsoUtc(post.dateGmt),
        loc: selfAlternate.href,
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
  const pageEntries = (pagesResponse.pages?.nodes ?? []).flatMap((rawPage) => {
    const rawVariants = [rawPage, ...(rawPage.translations ?? [])].filter(
      (rawVariant): rawVariant is NonNullable<typeof rawVariant> => Boolean(rawVariant),
    );

    const variants = rawVariants.flatMap((rawVariant) => {
      const variant = useFragment(PageFieldFragment, rawVariant);
      const lang = variant.language?.slug;
      if (!lang || !variant.slug) return [];

      const seo = variant.seo ? useFragment(PostTypeSeoFragment, variant.seo) : undefined;
      return [
        {
          href: url(`/${lang}/${variant.slug}`),
          hreflang: lang,
          noindex: isNoindex(seo?.metaRobotsNoindex),
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

  // Matches the pageSize used for pagination in
  // src/pages/[lang]/category/[slug]/[page].astro — category archives
  // beyond this many posts split into additional prerendered (and
  // therefore crawlable) pages.
  const CATEGORY_PAGE_SIZE = 6;

  // WPGraphQL's root `categories` connection already returns every term
  // flat — children included as their own `nodes` entries (confirmed by
  // MainFooter.astro rendering the same connection with no children
  // traversal). Walking `children`/`children.children` on top of that
  // duplicated every child category 2-3x in the sitemap.
  const categoryUrls: SitemapUrl[] = (categoriesResponse.categories?.nodes ?? []).flatMap(
    (rawCategory) => {
      const category = useFragment(CategoryFields, rawCategory);
      const lang = category.language?.slug;
      if (!lang || !category.slug) return [];

      const totalPages = Math.max(1, Math.ceil((category.count ?? 0) / CATEGORY_PAGE_SIZE));
      const basePath = removeLocaleCode(category.slug);

      // hreflang alternates only make sense for page 1 — a translated
      // category archive won't reliably have the same post count, so its
      // own pagination doesn't line up page-for-page with this one.
      const translationAlternates = (category.translations ?? []).flatMap((translation) => {
        const translationLang = translation?.language?.slug;
        if (!translationLang || !translation?.slug) return [];
        const translationPath = removeLocaleCode(translation.slug);
        return [
          {
            href: url(`/${translationLang}/category/${firstCategoryPage(translationPath)}`),
            hreflang: translationLang,
          },
        ];
      });

      return Array.from({ length: totalPages }, (_, index) => ({
        alternates:
          index === 0
            ? [
                { href: url(`/${lang}/category/${firstCategoryPage(basePath)}`), hreflang: lang },
                ...translationAlternates,
              ]
            : undefined,
        loc: url(`/${lang}/category/${firstCategoryPage(basePath, String(index + 1))}`),
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
