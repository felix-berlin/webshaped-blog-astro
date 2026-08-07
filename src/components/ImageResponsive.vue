<template>
  <picture v-if="src">
    <source
      :srcset="createSrcSet(props.srcSet, props.src, 'webp') ?? undefined"
      type="image/webp"
      :sizes="sizes ?? ''"
    />
    <source
      :srcset="createSrcSet(props.srcSet, props.src, 'jpeg') ?? undefined"
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

export interface ImageResponsiveProps {
  aboveTheFold?: boolean;
  alt?: Maybe<string>;
  height?: Maybe<number>;
  sizes?: Maybe<string>;
  src: Maybe<string>;
  srcSet?: Maybe<string>;
  width?: Maybe<number>;
}

type Maybe<T> = null | T | undefined;

const props = defineProps<ImageResponsiveProps>();

const createSrcSet = (srcSet: Maybe<string>, src: Maybe<string>, format: string) => {
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

const loading = ref<"eager" | "lazy">("lazy");
const fetchPriority = ref<"auto" | "high" | "low">("auto");

if (props.aboveTheFold) {
  loading.value = "eager";
  fetchPriority.value = "high";
}
</script>
