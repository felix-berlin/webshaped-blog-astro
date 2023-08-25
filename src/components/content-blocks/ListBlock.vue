<template>
  <component
    :is="parse(block.attributesJSON)?.ordered ? 'ol' : 'ul'"
    class="c-blocks__list"
    :class="
      parse(block.attributesJSON)?.ordered
        ? 'c-blocks__list--ordered'
        : 'c-blocks__list--unordered'
    "
  >
    <ListItemBlock
      v-for="listItem in block.innerBlocks"
      :key="parse(listItem.attributesJSON).content"
      :block="listItem"
      class="c-blocks__list-item"
    >
      <ListBlock
        v-if="listItem?.innerBlocks[0]"
        :block="listItem.innerBlocks[0]"
      ></ListBlock>
    </ListItemBlock>
  </component>
</template>

<script setup lang="ts">
import { parse } from "@utils/helpers";
import ListItemBlock from "@components/content-blocks/ListItemBlock.vue";
import type { CoreListBlock } from "@ts_types/generated/graphql";

export interface ListBlockProps {
  block: CoreListBlock;
}

defineProps<ListBlockProps>();
</script>
