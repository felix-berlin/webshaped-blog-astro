<template>
  <figure class="c-blocks__image">
    <ImageResponsive
      v-if="block.name === 'core/image'"
      :id="blockAttrs.id"
      :src="mediaItem?.mediaItemUrl"
      :src-set="mediaItem?.srcSet"
      :width="mediaItem?.mediaDetails?.width"
      :height="mediaItem?.mediaDetails?.height"
      :alt="mediaItem?.altText"
      class="c-blog__hero-image"
    />
    <figcaption v-if="blockAttrs.caption" v-html="blockAttrs.caption" />
  </figure>
</template>

<script setup lang="ts">
import { parse } from "@utils/helpers";
import ImageResponsive from "@components/ImageResponsive.vue";
import type { CoreImageBlock } from "@ts_types/generated/graphql";

export interface FigureBlockProps {
  block: CoreImageBlock;
}

const props = defineProps<FigureBlockProps>();

const blockAttrs = parse(props.block.attributesJSON);
const mediaItem = props.block.mediaItem?.node;
</script>
