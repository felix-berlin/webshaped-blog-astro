<template>
  <div class="c-buttons">
    <ButtonBlock
      v-for="(button, index) in buttons"
      :key="button.attributes?.text ?? index"
      :block="button"
    />
  </div>
</template>

<script setup lang="ts">
import ButtonBlock from "@components/content-blocks/ButtonBlock.vue";
import { CoreButton } from "@services/fragments/blockFragments";
import { computed } from "vue";

import type { CoreButtonsFragment } from "@/gql/graphql.ts";

import { useFragment } from "@/gql";

export interface ButtonsBlockProps {
  block: CoreButtonsFragment;
}

const { block } = defineProps<ButtonsBlockProps>();

const buttons = computed(() =>
  useFragment(
    CoreButton,
    (block.innerBlocks ?? []).filter(
      (innerBlock): innerBlock is NonNullable<typeof innerBlock> => innerBlock != null,
    ),
  ),
);
</script>

<style scoped lang="scss">
@use "@styles/components/content-blocks/buttons-block";
</style>
