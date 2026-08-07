<template>
  <p class="c-blocks__paragraph" v-html="block.attributes?.content" />
</template>

<script setup lang="ts">
import { parse } from "@utils/helpers";

import type { CoreParagraphFragment } from "@/gql/graphql.ts";

export interface ParagraphBlockProps {
  block: CoreParagraphFragment;
}

defineProps<ParagraphBlockProps>();
</script>
