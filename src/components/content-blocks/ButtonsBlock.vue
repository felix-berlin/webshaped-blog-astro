<template>
  <div class="c-buttons">
    <ButtonBlock v-for="button in block.innerBlocks" :key="button.text" :block="button" />
  </div>
</template>

<script setup lang="ts">
import ButtonBlock from "@components/content-blocks/ButtonBlock.vue";
import type { CoreButtonsBlock } from "@ts_types/generated/graphql";

export interface ButtonBlockProps {
  block: CoreButtonsBlock;
}

const { block } = defineProps<ButtonBlockProps>();
</script>

<style scoped lang="scss">
@use "@styles/components/content-blocks/buttons-block";
</style>
