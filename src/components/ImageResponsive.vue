<template>
  <picture v-if="src">
    <source
      :srcset="createSrcSet(props.srcSet, props.src, 'webp')"
      type="image/webp"
      :sizes="sizes ?? ''"
    />
    <source
      :srcset="createSrcSet(props.srcSet, props.src, 'jpeg')"
      type="image/jpeg"
      :sizes="sizes ?? ''"
    />
    <img
      :src="src"
      :alt="alt ?? ''"
      :width="width ?? ''"
      :height="height ?? ''"
      decoding="async"
      :loading="loading"
      :fetchpriority="fetchPriority"
      :sizes="sizes ?? ''"
    />
  </picture>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Maybe } from "@/gql/graphql.ts";

export interface ImageResponsiveProps {
  src: Maybe<string>;
  srcSet?: Maybe<string>;
  sizes?: Maybe<string>;
  alt?: Maybe<string>;
  width?: Maybe<number>;
  height?: Maybe<number>;
  aboveTheFold?: boolean;
}

const props = defineProps<ImageResponsiveProps>();

const createSrcSet = (srcSet: string, src: string, format: string) => {
  // if src contains gif or svg return without jpg
  if (src?.match(/\.gif|\.svg$/)) {
    return srcSet;
  }

  return srcSet
    ?.split(",")
    .map((src) => {
      const [url, size] = src.trim().split(" ");
      const jpgUrl = `${url}.${format}`;
      return `${jpgUrl} ${size}`;
    })
    .join(", ");
};

const loading = ref("lazy");
const fetchPriority = ref("auto");

if (props.aboveTheFold) {
  loading.value = "eager";
  fetchPriority.value = "high";
}
</script>
