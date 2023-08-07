<template>
  <img
    v-if="src"
    :srcset="webpJpgSrcSet"
    :src="src"
    :alt="alt ?? ''"
    :width="width ?? ''"
    :height="height ?? ''"
    decoding="async"
    :loading="loading"
    :fetchpriority="fetchPriority"
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Maybe } from "@ts_types/generated/graphql";

export interface ImageResponsiveProps {
  src: Maybe<string>;
  srcSet: Maybe<string>;
  sizes?: Maybe<string>;
  alt?: Maybe<string>;
  width?: Maybe<number>;
  height?: Maybe<number>;
  aboveTheFold?: boolean;
}

const props = defineProps<ImageResponsiveProps>();

/**
 * Generate a srcset with webp and jpg
 *
 * @return  {string}
 */
const webpJpgSrcSet = computed((): Maybe<string> => {
  // if src contains gif or svg return without webp
  if (props?.src?.match(/\.gif|\.svg$/)) {
    return props?.srcSet;
  }

  return props?.srcSet
    ?.split(",")
    .map((src) => {
      const [url, size] = src.trim().split(" ");
      const webpUrl = `${url}.webp`;
      return `${webpUrl} ${size}, ${src}`;
    })
    .join(", ");
});

const loading = ref("lazy");
const fetchPriority = ref("auto");

if (props.aboveTheFold) {
  loading.value = "eager";
  fetchPriority.value = "high";
}
</script>
