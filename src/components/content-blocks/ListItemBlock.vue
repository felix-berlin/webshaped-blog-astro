<template>
  <li>
    <span v-html="block.attributes.content"></span>
    <slot></slot>
  </li>
</template>

<script setup lang="ts">
import type { CoreListItem } from "@ts_types/generated/graphql";

export interface ListItemBlockProps {
  block: CoreListItem;
}
defineProps<ListItemBlockProps>();
</script>
