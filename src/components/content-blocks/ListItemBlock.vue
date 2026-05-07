<template>
  <li>
    <span v-html="block.attributes.content" />
    <slot />
  </li>
</template>

<script setup lang="ts">
import type { CoreListItem } from "@/gql/graphql.ts";

export interface ListItemBlockProps {
  block: CoreListItem;
}
defineProps<ListItemBlockProps>();
</script>
