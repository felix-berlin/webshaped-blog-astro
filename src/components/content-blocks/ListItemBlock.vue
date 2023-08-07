<template>
  <li>
    <span v-html="parse(block.attributesJSON).content"></span>
    <slot></slot>
  </li>
</template>

<script setup lang="ts">
import { parse } from "@utils/helpers";
import type { CoreListItemBlock } from "../../types/generated/graphql";

export interface ListItemBlockProps {
  block: CoreListItemBlock;
}
defineProps<ListItemBlockProps>();
</script>
