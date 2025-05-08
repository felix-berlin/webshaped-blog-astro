<template>
  <p class="c-blocks__paragraph" v-html="block.attributes.content" />
</template>

<script setup lang="ts">
import { parse } from "@utils/helpers";
import type { CoreParagraph } from "@/gql/graphql.ts";

export interface ParagraphBlockProps {
  block: CoreParagraph;
}

defineProps<ParagraphBlockProps>();
</script>
