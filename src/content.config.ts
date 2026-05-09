import { defineCollection } from "astro:content";
import { readFile, readdir } from "node:fs/promises";
import { basename, extname } from "node:path";

const i18n = defineCollection({
  loader: async () => {
    const dirUrl = new URL("./content/i18n/", import.meta.url);
    const entries = await readdir(dirUrl);

    const localeFiles = entries.filter((entry) => extname(entry) === ".json");

    return Promise.all(
      localeFiles.map(async (fileName) => {
        const fileUrl = new URL(`./content/i18n/${fileName}`, import.meta.url);
        const raw = await readFile(fileUrl, "utf-8");

        return {
          id: basename(fileName, ".json"),
          ...JSON.parse(raw),
        };
      }),
    );
  },
});

export const collections = {
  i18n,
};
