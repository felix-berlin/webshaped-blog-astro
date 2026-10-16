import rss from "@astrojs/rss";
import { wpQuery } from "@services/wpGraphqlClient";
import { localeStrings } from "@utils/i18n/ui";
import { postPathBuilder, toLanguageCode } from "@utils/i18n/utils";

import { GetPostsPreviewDocument } from "@/gql/graphql.ts";

export const GET = async (context) => {
  const lang = context.params.lang;

  // Unknown langs (crawlers on /fr/rss.xml) get an empty feed instead of a
  // GraphQL enum error. The preview query carries every field the feed needs.
  const posts =
    lang in localeStrings
      ? ((
          await wpQuery(GetPostsPreviewDocument, {
            field: "DATE",
            languages: [toLanguageCode(lang)],
            order: "DESC",
          })
        ).posts?.nodes ?? [])
      : [];

  // Map the posts to the RSS items format
  const items = posts.map((post) => ({
    description: post.excerpt,
    link: new URL(postPathBuilder(post.slug, post.language?.slug ?? lang), context.site).toString(),
    pubDate: post.dateGmt,
    title: post.title,
  }));

  return rss({
    customData: `<language>${lang}</language>`,
    description: "Ein bescheidener Astronaut und sein Weg zu den Sternen",
    items,
    site: context.site,
    stylesheet: "/rss/pretty-feed-v3.xsl",
    title: `Web Shaped Blog (${lang.toUpperCase()})`,
  });
};
