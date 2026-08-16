import type { APIContext } from "astro";

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

export const GET = async ({ site }: APIContext) => {
  const url = (path: string) => new URL(path, site).toString();

  const [postsResponse, categoriesResponse, pagesResponse] = await Promise.all([
    wpQuery(GetPostsPreviewDocument, { languages: ["DE", "EN"] }),
    wpQuery(GetAllCategoriesDocument, {}),
    wpQuery(GetPagesBySlugsDocument, { slugs: ["datenschutz", "impressum", "ueber-mich"] }),
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

  const pageEntries = (pagesResponse.pages?.nodes ?? []).flatMap((rawPage) => {
    const page = useFragment(PageFieldFragment, rawPage);
    const lang = page.language?.slug;
    if (!lang || !page.slug) return [];

    const pageSeo = page.seo ? useFragment(PostTypeSeoFragment, page.seo) : undefined;
    const selfAlternate = { href: url(`/${lang}/${page.slug}`), hreflang: lang };
    const translationAlternates = (rawPage.translations ?? []).flatMap((rawTranslation) => {
      if (!rawTranslation) return [];
      const translation = useFragment(PageFieldFragment, rawTranslation);
      const translationLang = translation.language?.slug;
      if (!translationLang || !translation.slug) return [];
      return [{ href: url(`/${translationLang}/${translation.slug}`), hreflang: translationLang }];
    });

    // No lastmod: PageFieldFragment doesn't request modifiedGmt, and these
    // legal/about pages change rarely enough that omitting it (valid per
    // the sitemap spec) beats faking a date.
    return [
      {
        alternates: [selfAlternate, ...translationAlternates],
        loc: selfAlternate.href,
        noindex: isNoindex(pageSeo?.metaRobotsNoindex),
      },
    ];
  });
  const pageUrls = dropNoindexed(pageEntries);

  // Matches the pageSize used for pagination in
  // src/pages/[lang]/category/[slug]/[page].astro — category archives
  // beyond this many posts split into additional prerendered (and
  // therefore crawlable) pages.
  const CATEGORY_PAGE_SIZE = 6;

  // Categories nest up to two levels deep (children -> children) in the
  // query, mirroring how the footer/header menus walk the same tree.
  const categoryUrls: SitemapUrl[] = (categoriesResponse.categories?.nodes ?? []).flatMap(
    (rawCategory) => {
      const rawChildren = rawCategory.children?.nodes ?? [];
      const rawGrandchildren = rawChildren.flatMap((rawChild) => rawChild.children?.nodes ?? []);

      return [rawCategory, ...rawChildren, ...rawGrandchildren].flatMap((raw) => {
        const category = useFragment(CategoryFields, raw);
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
      });
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
