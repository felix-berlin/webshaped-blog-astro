<template>
  <figure class="c-blocks__image">
    <ImageResponsive
      v-if="block.name === 'core/image'"
      :id="attributes?.id"
      :src="attributes?.src"
      :width="mediaDetails?.width"
      :height="mediaDetails?.height"
      :alt="attributes?.alt"
      class="c-blog__hero-image"
    />
    <figcaption v-if="attributes?.caption" v-html="attributes?.caption" />
  </figure>
</template>

<script setup lang="ts">
import ImageResponsive from "@components/ImageResponsive.vue";
import type { CoreImage } from "@/gql/graphql.ts";

export interface FigureBlockProps {
  block: CoreImage;
}

const props = defineProps<FigureBlockProps>();

const attributes = props.block.attributes;
const mediaDetails = props.block.mediaDetails;
</script>
