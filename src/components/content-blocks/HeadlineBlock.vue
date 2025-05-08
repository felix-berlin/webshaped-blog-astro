<template>
  <component
    :is="`h${headlineLevel}`"
    :id="generateId()"
    :class="`c-blocks__heading c-blocks__heading--${headlineLevel}`"
  >
    <span v-if="isHtml(headline)" v-html="headline" />

    <template v-else>
      {{ he.decode(headline) }}
    </template>
  </component>
</template>

<script setup lang="ts">
import { isHtml, getHtmlContent } from "@utils/helpers";
import slugify from "slugify";
import type { CoreHeading } from "@/gql/graphql.ts";
import he from "he";

export interface HeadlineBlockProps {
  block: CoreHeading;
}

const { block } = defineProps<HeadlineBlockProps>();

const headline = block.attributes?.content;
const headlineLevel = block.attributes?.level;

/**
 * Generates an id for the headline.
 *
 * @return  {string}
 */
const generateId = (): string => {
  return isHtml(headline) ? getHtmlContent(headline) : slugify(headline, { lower: true });
};
</script>
