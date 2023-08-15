import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export const get = async () =>
  rss({
    // `<title>`-Feld in der XML-Ausgabe
    title: "Web Shaped Blog",
    // `<description>`-Feld in der XML-Ausgabe
    description: "Ein bescheidener Astronaut und sein Weg zu den Sternen",
    // Basis-URL für RSS-<item>-Links
    // SITE verwendet "site" aus der astro.config deines Projekts.
    site: import.meta.env.SITE,
    // Liste von `<item>`-Elementen in der XML-Ausgabe
    // Einfaches Beispiel: Items für jede md-Datei in /src/pages erzeugen
    // Siehe Abschnitt "Generieren von `items`" für erforderliche Frontmatter und erweiterte Anwendungsfälle
    items: await pagesGlobToRssItems(
      import.meta.glob(["./dist/de/**/*.html", "./dist/en/**/*.html"]),
    ),
    // (optional) Benutzerdefinierten XML-Code einfügen
    customData: `<language>de-de</language>`,
    stylesheet: "/rss/pretty-feed-v3.xsl",
  });
