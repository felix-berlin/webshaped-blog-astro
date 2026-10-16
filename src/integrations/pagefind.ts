import type { AstroIntegration } from "astro";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createIndex } from "pagefind";
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

// Fail the build rather than log: a build that exits 0 without an index ships
// a site whose search is silently broken.
const assertNoErrors = (step: string, errors: string[]): void => {
  if (errors.length) throw new Error(`Pagefind failed to ${step}:\n${errors.join("\n")}`);
};

export default function pagefind(): AstroIntegration {
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

        const { errors: createErrors, index } = await createIndex();
        if (!index) throw new Error(`Pagefind failed to create index:\n${createErrors.join("\n")}`);
        const htmlFiles = await collectHtmlFiles(outDir);
        // The pagefind service handles requests concurrently, so read + index all files in parallel.
        const results = await Promise.all(
          htmlFiles.map(async (filePath) =>
            index.addHTMLFile({
              content: await readFile(filePath, "utf-8"),
              url: urlFor(outDir, filePath),
            }),
          ),
        );
        assertNoErrors(
          "index files",
          results.flatMap(({ errors }) => errors),
        );
        logger.info(`Pagefind indexed ${results.filter(({ file }) => file).length} pages`);
        const { errors: writeErrors, outputPath } = await index.writeFiles({
          outputPath: path.join(outDir, "pagefind"),
        });
        assertNoErrors("write index", writeErrors);
        logger.info(`Pagefind wrote index to ${outputPath}`);
      },
      "astro:config:setup": ({ config }) => {
        outDir = fileURLToPath(
          config.adapter?.name === "@astrojs/node" ? config.build.client : config.outDir,
        );
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
