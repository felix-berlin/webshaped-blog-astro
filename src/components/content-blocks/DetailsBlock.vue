<template>
  <details :open="showContent" class="c-block-details">
    <summary class="c-block-details__summary">
      {{ summary }}
    </summary>
    <template v-if="block.innerBlocks?.length">
      <ContentBlocks :blocks="block.innerBlocks as ContentBlocksProps['blocks']" />
    </template>
  </details>
</template>

<script setup lang="ts">
import ContentBlocks, { type ContentBlocksProps } from "@components/ContentBlocks.vue";

import type { CoreDetailsFragment } from "@/gql/graphql.ts";

export interface DetailsBlockProps {
  block: CoreDetailsFragment;
}

const props = defineProps<DetailsBlockProps>();

const { showContent, summary } = props.block.attributes ?? {};
</script>
