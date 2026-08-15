import type { AstroIntegration } from "astro";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createIndex, type PagefindServiceConfig } from "pagefind";
import sirv from "sirv";

// Astro's `trailingSlash: "never"` means built pages live at
// `<dir>/index.html` on disk but must be served without a trailing slash
// (`/de/posts/foo`, not `/de/posts/foo/`). Pagefind's `addDirectory` derives
// result URLs straight from the file path and keeps that slash, so search
// results 404'd against the site's own routing. Indexing files individually
// via `addHTMLFile` with an explicit, slash-stripped `url` avoids that.
const collectHtmlFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      if (entry.name === "pagefind") return [];
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectHtmlFiles(fullPath);
      return entry.name.endsWith(".html") ? [fullPath] : [];
    }),
  );
  return files.flat();
};

const urlFor = (outDir: string, filePath: string): string => {
  const relPath = path.relative(outDir, filePath).split(path.sep).join("/");
  const stripped = relPath.replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "");
  return `/${stripped}`;
};

/**
 * Pagefind Astro integration options.
 */
export interface PagefindOptions {
  /**
   * `PagefindServiceConfig` passed to pagefind's `createIndex`
   */
  indexConfig?: PagefindServiceConfig;
}

export default function pagefind({ indexConfig }: PagefindOptions = {}): AstroIntegration {
  let outDir: string;
  return {
    hooks: {
      "astro:build:done": async ({ logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search index will not be built.",
          );
          return;
        }

        const { errors: createErrors, index } = await createIndex(indexConfig);
        if (!index) {
          logger.error("Pagefind failed to create index");
          createErrors.forEach((e) => logger.error(e));
          return;
        }
        const htmlFiles = await collectHtmlFiles(outDir);
        const addErrors: string[] = [];
        let page_count = 0;
        for (const filePath of htmlFiles) {
          const { errors, file } = await index.addHTMLFile({
            content: await readFile(filePath, "utf-8"),
            url: urlFor(outDir, filePath),
          });
          addErrors.push(...errors);
          if (file) page_count++;
        }
        if (addErrors.length) {
          logger.error("Pagefind failed to index files");
          addErrors.forEach((e) => logger.error(e));
          return;
        } else {
          logger.info(`Pagefind indexed ${page_count} pages`);
        }
        const { errors: writeErrors, outputPath } = await index.writeFiles({
          outputPath: path.join(outDir, "pagefind"),
        });
        if (writeErrors.length) {
          logger.error("Pagefind failed to write index");
          writeErrors.forEach((e) => logger.error(e));
          return;
        } else {
          logger.info(`Pagefind wrote index to ${outputPath}`);
        }
      },
      "astro:config:setup": ({ config }) => {
        // if (config.output === "server") {
        //   logger.warn(
        //     "Output type `server` does not produce static *.html pages in its output and thus will not work with astro-pagefind integration.",
        //   );
        //   return;
        // }

        if (config.adapter?.name === "@astrojs/cloudflare") {
          outDir = fileURLToPath(new URL(config.base?.replace(/^\//, ""), config.outDir));
        } else if (config.adapter?.name === "@astrojs/node") {
          outDir = fileURLToPath(config.build.client);
        } else {
          outDir = fileURLToPath(config.outDir);
        }
      },
      "astro:server:setup": ({ logger, server }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search assets will not be served.",
          );
          return;
        }

        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/pagefind/")) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
    },
    name: "pagefind",
  };
}
