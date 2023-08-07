<template>
  <component :is="parse(block.attributesJSON)?.ordered ? 'ol' : 'ul'">
    <ListItemBlock
      v-for="listItem in block.innerBlocks"
      :key="parse(listItem.attributesJSON)?.content"
      :block="listItem"
    >
      <ListBlock
        v-if="listItem.innerBlocks[0]"
        :block="listItem.innerBlocks[0]"
      ></ListBlock>
    </ListItemBlock>
  </component>
</template>

<script setup lang="ts">
import { parse } from "@lib/helpers";
import ListItemBlock from "@components/content-blocks/ListItemBlock.vue";

export interface ListBlockProps {
  block: string;
}

defineProps<ListBlockProps>();
</script>
