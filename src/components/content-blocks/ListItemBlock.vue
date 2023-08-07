<template>
  <li>
    {{ parse(block.attributesJSON)?.content }}
    <slot></slot>
  </li>
</template>

<script setup lang="ts">
import { parse } from "@lib/helpers";

export interface ListItemBlockProps {
  block: object;
}

const props = defineProps<ListItemBlockProps>();
</script>
