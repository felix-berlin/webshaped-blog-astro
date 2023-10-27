<template>
  <a
    :href="blockAttrs?.url"
    :title="blockAttrs?.title"
    :target="blockAttrs?.target"
    :rel="blockAttrs?.rel"
    class="c-button c-button--primary"
    >{{ blockAttrs?.text }}</a
  >
</template>

<script setup lang="ts">
import { parse } from "@utils/helpers";
import type { CoreButtonsBlock } from "@ts_types/generated/graphql";

export interface ButtonBlockProps {
  block: CoreButtonsBlock["innerBlocks"];
}

const props = defineProps<ButtonBlockProps>();

const blockAttrs = parse(props.block?.attributesJSON);
</script>
