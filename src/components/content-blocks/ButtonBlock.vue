<template>
  <a
    :href="url"
    :title="title"
    :target="linkTarget"
    :rel="rel"
    class="c-button c-button--primary"
  >{{ text }}</a>
</template>

<script setup lang="ts">
import type { CoreButton } from "@/gql/graphql.ts";

export interface ButtonBlockProps {
  block: CoreButton;
}

const props = defineProps<ButtonBlockProps>();

const { linkTarget, rel, text, textAlign, title, type, url } = props.block?.attributes;
</script>
