<template>
  <nav :id="tocId" class="c-toc">
    <template v-for="headline in headings" :key="headline">
      <a
        :href="`#${
          isHtml(parse(headline.attributesJSON).content)
            ? getHtmlContent(parse(headline.attributesJSON).content)
            : slugify(parse(headline.attributesJSON).content, {
                lower: true,
              })
        }`"
        :class="[
          `c-toc__link c-toc__link--depth-${
            parse(headline.attributesJSON).level
          }`,
          {
            'is-active':
              activeHeadline ===
              slugify(parse(headline.attributesJSON).content, {
                lower: true,
              }),
          },
        ]"
      >
        <template v-if="isHtml(parse(headline.attributesJSON).content)">
          {{ getHtmlContent(parse(headline.attributesJSON).content) }}
        </template>
        <template v-else>
          {{ parse(headline.attributesJSON).content }}
        </template>
      </a>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import slugify from "slugify";
import { isHtml, parse, getHtmlContent } from "@utils/helpers";
import type { CoreHeadingBlock } from "@ts_types/generated/graphql";

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
