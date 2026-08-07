<template>
  <li>
    <span v-html="block.attributes?.content" />
    <slot />
  </li>
</template>

<script setup lang="ts">
import type { ListItemNode } from "@components/content-blocks/ListBlock.vue";

export interface ListItemBlockProps {
  block: ListItemNode;
}

defineProps<ListItemBlockProps>();
</script>
