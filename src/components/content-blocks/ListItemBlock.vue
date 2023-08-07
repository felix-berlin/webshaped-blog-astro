<template>
  <li>
    {{ parse(block.attributesJSON)?.content }}
    <slot></slot>
  </li>
</template>

<script setup lang="ts">
import { parse } from "@lib/helpers";
import type { CoreListItemBlock } from "../../types/generated/graphql";

export interface ListItemBlockProps {
  block: CoreListItemBlock;
}
defineProps<ListItemBlockProps>();
</script>
