<template>
  <details :open="showContent" class="c-block-details">
    <summary class="c-block-details__summary">{{ summary }}</summary>
    <template v-if="block.innerBlocks?.length">
      <ContentBlocks :blocks="block.innerBlocks" />
    </template>
  </details>
</template>

<script setup lang="ts">
import ContentBlocks from "@components/ContentBlocks.vue";
import type { CoreDetails } from "@/gql/graphql.ts";

export interface FigureBlockProps {
  block: CoreDetails;
}

const props = defineProps<FigureBlockProps>();

const { showContent, summary } = props.block.attributes;
</script>
