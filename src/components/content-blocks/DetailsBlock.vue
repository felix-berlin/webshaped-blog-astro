<template>
  <details :open="blockAttrs.showContent" class="c-block-details">
    <summary class="c-block-details__summary">{{ blockAttrs.summary }}</summary>
    <template v-if="block.innerBlocks?.length">
      <ContentBlocks :blocks="block.innerBlocks" />
    </template>
  </details>
</template>

<script setup lang="ts">
import { parse } from "@utils/helpers";
import ContentBlocks from "@components/ContentBlocks.vue";
import type { CoreDetailsBlock } from "@ts_types/generated/graphql";

export interface FigureBlockProps {
  block: CoreDetailsBlock;
}

const props = defineProps<FigureBlockProps>();

const blockAttrs = parse(props.block.attributesJSON);
</script>
