<template>
  <p class="c-blocks__paragraph" v-html="block.attributes.content" />
</template>

<script setup lang="ts">
import { parse } from "@utils/helpers";
import type { CoreParagraph } from "@ts_types/generated/graphql";

export interface ParagraphBlockProps {
  block: CoreParagraph;
}

defineProps<ParagraphBlockProps>();
</script>
