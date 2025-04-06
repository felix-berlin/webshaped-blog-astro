<template>
  <a
    :href="url"
    :title="title"
    :target="linkTarget"
    :rel="rel"
    class="c-button c-button--primary"
    >{{ text }}</a
  >
</template>

<script setup lang="ts">
import type { CoreButton } from "@ts_types/generated/graphql";

export interface ButtonBlockProps {
  block: CoreButton;
}

const props = defineProps<ButtonBlockProps>();

const { text, type, url, textAlign, title, linkTarget, rel } = props.block?.attributes;
</script>
