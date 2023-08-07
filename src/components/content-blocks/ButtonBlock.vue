<template>
  <template v-for="button in block.innerBlocks" :key="button.text">
    <a
      :href="parse(button.attributesJSON)?.url"
      :title="parse(button.attributesJSON)?.title"
      :target="parse(button.attributesJSON)?.target"
      :rel="parse(button.attributesJSON)?.rel"
      :class="`c-buttons__button ${parse(button.attributesJSON)?.className}`"
      >{{ parse(button.attributesJSON)?.text }}</a
    >
  </template>
</template>

<script setup lang="ts">
import { parse } from "@utils/helpers";
import type { CoreButtonsBlock } from "@ts_types/generated/graphql";

export interface ButtonBlockProps {
  block: CoreButtonsBlock;
}

defineProps<ButtonBlockProps>();
</script>
