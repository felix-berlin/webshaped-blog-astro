<template>
  <figure v-if="attributes?.src" class="c-blocks__image">
    <picture>
      <source
        v-for="format in formats"
        :key="format"
        :type="`image/${format}`"
        :srcset="buildSrcSet(attributes.src, format)"
        sizes="(min-width: 800px) 800px, 100vw"
      />
      <img
        :src="imagorSrc(attributes.src, width, height, fallbackFormat)"
        :alt="attributes?.alt ?? ''"
        :width="width"
        :height="height"
        loading="lazy"
        decoding="async"
        class="c-blog__hero-image"
      />
    </picture>
    <figcaption v-if="attributes?.caption" v-html="attributes?.caption" />
  </figure>
</template>

<script setup lang="ts">
import { computeConstrainedSize } from "@utils/constrainedImageSize";
import { imagorSrc, RESPONSIVE_WIDTHS } from "@utils/imagorClient";

import type { CoreImageFragment } from "@/gql/graphql.ts";

export interface FigureBlockProps {
  block: CoreImageFragment;
}

const props = defineProps<FigureBlockProps>();

const attributes = props.block.attributes;

const { height, width } = computeConstrainedSize(
  800,
  props.block.mediaDetails?.width,
  props.block.mediaDetails?.height,
  "FigureBlock.vue",
);
const aspectRatio = height / width;

const formats = ["avif", "webp"];
const fallbackFormat = "webp";

const buildSrcSet = (src: string, format: string) =>
  RESPONSIVE_WIDTHS.map(
    (w) => `${imagorSrc(src, w, Math.round(w * aspectRatio), format)} ${w}w`,
  ).join(", ");
</script>
