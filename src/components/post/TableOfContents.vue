<template>
  <component :is="htmlElement" :id="tocId" class="c-toc">
    <template v-for="headline in headings" :key="headline">
      <a
        :href="createHref(headline)"
        :class="[
          `c-toc__link c-toc__link--depth-${headline.level}`,
          {
            'is-active': isActiveHeadline(headline),
          },
        ]"
        v-bind="
          isHtml(headline.content)
            ? { textContent: getHtmlContent(headline.content) }
            : { innerHTML: headline.content }
        "
      >
      </a>
    </template>
  </component>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import slugify from "slugify";
import { isHtml, getHtmlContent } from "@utils/helpers";

export interface TableOfContentsProps {
  headings: {
    content: string;
    level: number;
  }[];
  htmlElement?: string;
  tocId: string;
}

const { headings, tocId, htmlElement = "nav" } = defineProps<TableOfContentsProps>();

const emit = defineEmits(["currentHeadline"]);

const activeHeadlineId = ref("");
const observer = ref<IntersectionObserver | null>(null);

/**
 * Checks if the headline is active.
 *
 * @param   {}  headline
 *
 * @return  {boolean}
 */
const isActiveHeadline = (headline: TableOfContentsProps["headings"][0]): boolean => {
  return (
    activeHeadlineId.value ===
    slugify(headline.content, {
      lower: true,
    })
  );
};

/**
 * Creates the href for the headline.
 *
 * @param   {}  headline
 *
 * @return  {string}
 */
const createHref = (headline: TableOfContentsProps["headings"][0]): string => {
  const headlineContent = headline.content;

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
    if (!entry.isIntersecting) return;
    const headline = entry.target as HTMLElement;
    activeHeadlineId.value = headline.id;

    emit("currentHeadline", headline.textContent);
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
