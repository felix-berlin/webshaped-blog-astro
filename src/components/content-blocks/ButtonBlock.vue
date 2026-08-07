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
import type { CoreButtonFragment } from "@/gql/graphql.ts";

export interface ButtonBlockProps {
  block: CoreButtonFragment;
}

const props = defineProps<ButtonBlockProps>();

const linkTarget = props.block.attributes?.linkTarget ?? undefined;
const rel = props.block.attributes?.rel ?? undefined;
const text = props.block.attributes?.text ?? undefined;
const title = props.block.attributes?.title ?? undefined;
const url = props.block.attributes?.url ?? undefined;
</script>
