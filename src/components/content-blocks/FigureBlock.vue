<template>
  <figure class="c-blocks__image">
    <ImageResponsive
      v-if="block.name === 'core/image'"
      :id="id"
      :src="url"
      :width="width"
      :height="height"
      :alt="alt"
      class="c-blog__hero-image"
    />
    <figcaption v-if="caption" v-html="caption" />
  </figure>
</template>

<script setup lang="ts">
import ImageResponsive from "@components/ImageResponsive.vue";
import type { CoreImage } from "@ts_types/generated/graphql";

export interface FigureBlockProps {
  block: CoreImage;
}

const props = defineProps<FigureBlockProps>();

const { id, url, width, height, alt, caption } = props.block.attributes;
const mediaItem = props.block.mediaItem?.node;
</script>
