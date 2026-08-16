<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <title>XML Sitemap — webshaped.de</title>
        <style>
          :root { color-scheme: light dark; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 2rem 1.5rem 3rem;
            color: #1c1e21;
            background: #f6f5f2;
          }
          @media (prefers-color-scheme: dark) {
            body { color: #e7e5e0; background: #14171a; }
            table { background: #1b1f23 !important; border-color: #2c3238 !important; }
            th { background: #21262b !important; color: #9aa0a6 !important; }
            td { border-color: #262b30 !important; }
            a { color: #4fa98c !important; }
            .lang { background: #1c2925 !important; color: #4fa98c !important; }
            .meta { color: #9aa0a6 !important; }
          }
          h1 { font-size: 1.25rem; margin: 0 0 0.25rem; }
          p.meta { color: #5c6066; font-size: 0.85rem; margin: 0 0 1.5rem; }
          .wrap { max-width: 960px; margin: 0 auto; }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border: 1px solid #dcd8d0;
            border-radius: 6px;
            overflow: hidden;
          }
          th, td {
            text-align: left;
            padding: 0.55rem 0.75rem;
            border-bottom: 1px solid #ece9e3;
            font-size: 0.85rem;
            vertical-align: top;
          }
          th {
            background: #edeae4;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            font-size: 0.7rem;
            color: #5c6066;
          }
          tr:last-child td { border-bottom: none; }
          a { color: #1f6e5c; text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .count { font-variant-numeric: tabular-nums; }
          .lang {
            display: inline-block;
            font-size: 0.7rem;
            padding: 0.1rem 0.4rem;
            border-radius: 3px;
            background: #e4efe9;
            color: #1f6e5c;
            margin: 0 0.25rem 0.15rem 0;
            font-family: ui-monospace, monospace;
          }
          .lastmod { font-variant-numeric: tabular-nums; white-space: nowrap; color: #5c6066; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>XML Sitemap</h1>
          <p class="meta">
            <span class="count"><xsl:value-of select="count(sitemap:urlset/sitemap:url)" /></span>
            URLs — generated for search engines, not meant for humans, but here we are.
            <a href="/">webshaped.de</a>
          </p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Languages</th>
                <th>Last modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc" />
                    </a>
                  </td>
                  <td>
                    <xsl:for-each select="xhtml:link">
                      <span class="lang">
                        <xsl:value-of select="@hreflang" />
                      </span>
                    </xsl:for-each>
                  </td>
                  <td class="lastmod">
                    <xsl:value-of select="sitemap:lastmod" />
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
