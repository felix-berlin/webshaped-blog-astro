import type { APIContext } from "astro";

import rss from "@astrojs/rss";
import { PostCardFields } from "@services/queries/getPostPreview";
import { wpQuery } from "@services/wpGraphqlClient";
import { toIsoUtc } from "@utils/helpers";
import { LOCALES } from "@utils/i18n/ui";
import { getLang, postPathBuilder, toLanguageCode } from "@utils/i18n/utils";

import { useFragment } from "@/gql";
import { GetPostsPreviewDocument } from "@/gql/graphql.ts";

// Built per locale at build time like the posts it lists, so unknown langs
// (crawlers on /fr/rss.xml) 404 at the router instead of reaching WordPress.
export const prerender = true;

export const getStaticPaths = () => LOCALES.map((lang) => ({ params: { lang } }));

export const GET = async ({ params, site }: APIContext) => {
  const lang = getLang(params.lang);

  const response = await wpQuery(GetPostsPreviewDocument, {
    field: "DATE",
    languages: [toLanguageCode(lang)],
    order: "DESC",
  });

  const items = (response.posts?.nodes ?? []).map((post) => {
    const card = useFragment(PostCardFields, post);
    return {
      description: card.excerpt ?? undefined,
      link: new URL(postPathBuilder(card.slug, card.language?.slug ?? lang), site).toString(),
      pubDate: post.dateGmt ? new Date(toIsoUtc(post.dateGmt) as string) : undefined,
      title: card.title ?? undefined,
    };
  });

  return rss({
    customData: `<language>${lang}</language>`,
    description: "Ein bescheidener Astronaut und sein Weg zu den Sternen",
    items,
    site: site ?? "",
    stylesheet: "/rss/pretty-feed-v3.xsl",
    title: `Web Shaped Blog (${lang.toUpperCase()})`,
  });
};
