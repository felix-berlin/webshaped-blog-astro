import { z, defineCollection } from "astro:content";

const i18n = defineCollection({
  type: "data",
});

export const collections = {
  i18n: i18n,
};
