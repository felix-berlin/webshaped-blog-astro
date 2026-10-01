<template>
  <component
    :is="`h${headlineLevel}`"
    :id="headingId(headline)"
    :class="`c-blocks__heading c-blocks__heading--${headlineLevel}`"
  >
    <span v-if="isHtml(headline)" v-html="headline" />

    <template v-else>
      {{ he.decode(headline) }}
    </template>
  </component>
</template>

<script setup lang="ts">
import { headingId, isHtml } from "@utils/helpers";
import he from "he";

import type { CoreHeadingFragment } from "@/gql/graphql.ts";

export interface HeadlineBlockProps {
  block: CoreHeadingFragment;
}

const { block } = defineProps<HeadlineBlockProps>();

const headline = block.attributes?.content ?? "";
const headlineLevel = block.attributes?.level;
</script>
