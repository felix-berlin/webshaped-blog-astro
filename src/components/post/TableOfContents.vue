<template>
  <nav :id="tocId" class="c-toc">
    <template v-for="headline in headings" :key="headline">
      <a
        :href="createHref(headline)"
        :class="[
          `c-toc__link c-toc__link--depth-${
            parse(headline.attributesJSON).level
          }`,
          {
            'is-active': isActiveHeadline(headline),
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

defineProps<TableOfContentsProps>();

const tocId = "tableOfContents";

const activeHeadline = ref("");

const observer = ref<IntersectionObserver | null>(null);

/**
 * Checks if the headline is active.
 *
 * @param   {CoreHeadingBlock}  headline
 *
 * @return  {boolean}
 */
const isActiveHeadline = (headline: CoreHeadingBlock): boolean => {
  return (
    activeHeadline.value ===
    slugify(parse(headline.attributesJSON).content, {
      lower: true,
    })
  );
};

/**
 * Creates the href for the headline.
 *
 * @param   {CoreHeadingBlock}  headline
 *
 * @return  {string}
 */
const createHref = (headline: CoreHeadingBlock): string => {
  const headlineContent = parse(headline.attributesJSON).content;

  const href = isHtml(headlineContent)
    ? getHtmlContent(headlineContent)
    : slugify(headlineContent, {
        lower: true,
      });

  return `#${href}`;
};

/**
 * Handles the intersection of the observer.
 *
 * @param   {IntersectionObserverEntry[]}  entries
 *
 * @return  {void}
 */
const handleIntersect = (entries: IntersectionObserverEntry[]): void => {
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
      .querySelectorAll(".c-blog__post h2[id], .c-blog__post h3[id]")
      .forEach((section) => observer.value?.observe(section));
});

onUnmounted(() => {
  observer.value?.disconnect();
});
</script>

<style lang="scss">
@use "@styles/components/table-of-contents.scss";
</style>
