<template>
  <component
    :is="`h${parse(block.attributesJSON).level}`"
    :id="
      isHtml(parse(block.attributesJSON).content)
        ? getHtmlContent(parse(block.attributesJSON).content)
        : slugify(parse(block.attributesJSON).content, { lower: true })
    "
    :class="`c-blocks__heading c-blocks__heading--${
      parse(block.attributesJSON).level
    }`"
  >
    <span
      v-if="isHtml(parse(block.attributesJSON).content)"
      v-html="parse(block.attributesJSON).content"
    />

    <template v-else>
      {{ parse(block.attributesJSON).content }}
    </template>
  </component>
</template>

<script setup lang="ts">
import { isHtml, parse, getHtmlContent } from "@utils/helpers";
import slugify from "slugify";
import type { CoreHeadingBlock } from "../../types/generated/graphql";

export interface HeadlineBlockProps {
  block: CoreHeadingBlock;
}

defineProps<HeadlineBlockProps>();
</script>
