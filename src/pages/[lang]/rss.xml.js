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
    // (optional) Benutzerdefinierten XML-Code einfügen
    customData: `<language>${lang}</language>`,
    // `<description>`-Feld in der XML-Ausgabe
    description: "Ein bescheidener Astronaut und sein Weg zu den Sternen",
    // Liste von `<item>`-Elementen in der XML-Ausgabe
    // Einfaches Beispiel: Items für jede md-Datei in /src/pages erzeugen
    // Siehe Abschnitt "Generieren von `items`" für erforderliche Frontmatter und erweiterte Anwendungsfälle
    items,
    // Basis-URL für RSS-<item>-Links
    // SITE verwendet "site" aus der astro.config deines Projekts.
    site: context.site,
    stylesheet: "/rss/pretty-feed-v3.xsl",
    // `<title>`-Feld in der XML-Ausgabe
    title: `Web Shaped Blog (${lang.toUpperCase()})`,
  });
};
