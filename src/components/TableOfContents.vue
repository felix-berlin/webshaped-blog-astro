<template>
  <nav :id="tocId" class="c-toc">
    <template v-for="(headline, index) in headings" :key="index">
      <a
        :href="`#${slugify(JSON.parse(headline.attributesJSON as string).content, {
          lower: true,
        })}`"
        :class="[
          `c-toc__link c-toc__link--depth-${
            JSON.parse(headline.attributesJSON as string).level
          }`,
          {
            'is-active':
              activeHeadline ===
              slugify(JSON.parse(headline.attributesJSON as string).content, {
                lower: true,
              }),
          },
        ]"
        >{{ JSON.parse(headline.attributesJSON as string).content }}</a
      >
    </template>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import slugify from "slugify";
import type { CoreHeadingBlock } from "../types/generated/graphql";

export interface TableOfContentsProps {
  headings: CoreHeadingBlock[] | undefined;
}

const props = defineProps<TableOfContentsProps>();

const tocId = "tableOfContents";

const activeHeadline = ref("");

const observer = ref<IntersectionObserver | null>(null);

const handleIntersect = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const headline = entry.target as HTMLElement;
      activeHeadline.value = headline.id;
    }
  });
};

onMounted(() => {
  observer.value = new IntersectionObserver(handleIntersect, {
    threshold: 0,
    rootMargin: "0px 0px -60% 0px",
  });
  if (observer.value)
    document
      .querySelectorAll(".c-blocks h2[id], .c-blocks h3[id]")
      .forEach((section) => observer.value?.observe(section));
});

onUnmounted(() => {
  observer.value?.disconnect();
});
</script>

<style lang="scss">
@use "@styles/components/table-of-contents.scss";
</style>
