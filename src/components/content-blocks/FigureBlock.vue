<template>
  <figure class="c-blocks__image">
    <ImageResponsive
      v-if="block.name === 'core/image'"
      :id="parse(block.attributesJSON).id"
      :src="block.mediaItem.node.mediaItemUrl"
      :src-set="block.mediaItem.node?.srcSet"
      :width="block.mediaItem.node?.mediaDetails?.width"
      :height="block.mediaItem.node?.mediaDetails?.height"
      :alt="block.mediaItem.alt"
      class="c-blog__hero-image"
    />
    <figcaption
      v-if="parse(block.attributesJSON).caption"
      v-html="parse(block.attributesJSON).caption"
    />
  </figure>
</template>

<script setup lang="ts">
import { isHtml, parse, getHtmlContent } from "@lib/helpers";
import ImageResponsive from "@components/ImageResponsive.vue";

export interface FigureBlockProps {
  block: object;
}

defineProps<FigureBlockProps>();
</script>
