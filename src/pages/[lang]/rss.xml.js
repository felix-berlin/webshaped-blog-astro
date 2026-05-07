import rss from "@astrojs/rss";
import { cacheExchange, Client, fetchExchange } from "@urql/core";
import { WP_API } from "astro:env/client";

import { GetAllPostsDocument } from "@/gql/graphql.ts";

export const GET = async (context) => {
  const lang = context.params.lang;

  const client = new Client({
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    url: WP_API,
  });

  const postsResponse = await client.query(GetAllPostsDocument, { size: 90 }).toPromise();

  // Filter posts by language
  const filteredPosts = postsResponse.data.posts.nodes.filter(
    (post) => post.language.slug === lang,
  );

  // Map the posts to the RSS items format
  const items = filteredPosts.map((post) => ({
    description: post.excerpt,
    // TODO: syncronize with createLocalizedUrl()
    link: `${context.site}/${post.language.slug}/posts/${post.slug}`,
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
