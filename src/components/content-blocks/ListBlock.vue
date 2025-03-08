<template>
  <component
    :is="blockAttrs?.ordered ? 'ol' : 'ul'"
    class="c-blocks__list"
    :class="blockAttrs?.ordered ? 'c-blocks__list--ordered' : 'c-blocks__list--unordered'"
  >
    <ListItemBlock
      v-for="listItem in block.innerBlocks"
      :key="listItem.attributes.content"
      :block="listItem"
      class="c-blocks__list-item"
    >
      <ListBlock v-if="listItem?.innerBlocks?.[0]" :block="listItem?.innerBlocks?.[0]"></ListBlock>
    </ListItemBlock>
  </component>
</template>

<script setup lang="ts">
import ListItemBlock from "@components/content-blocks/ListItemBlock.vue";
import type { CoreList } from "@ts_types/generated/graphql";

export interface ListBlockProps {
  block: CoreList;
}

const props = defineProps<ListBlockProps>();

const blockAttrs = props.block.attributes;
</script>
