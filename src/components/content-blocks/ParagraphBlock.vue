<template>
  <p class="c-blocks__paragraph" v-html="parse(block.attributesJSON).content" />
</template>

<script setup lang="ts">
import { isHtml, parse, getHtmlContent } from "@lib/helpers";
import type { CoreParagraphBlock } from "../types/generated/graphql";

export interface ParagraphBlockProps {
  block: CoreParagraphBlock;
}

defineProps<ParagraphBlockProps>();
</script>
