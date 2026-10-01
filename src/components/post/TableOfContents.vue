<template>
  <component :is="htmlElement" :id="tocId" class="c-toc">
    <template v-for="(item, index) in items" :key="index">
      <a
        :href="`#${item.id}`"
        :class="[
          `c-toc__link c-toc__link--depth-${item.level}`,
          {
            'is-active': activeHeadlineId === item.id,
          },
        ]"
        v-bind="item.attrs"
        @click="emit('tocLinkClicked')"
      />
    </template>
  </component>
</template>

<script setup lang="ts">
import { getHtmlContent, headingId, isHtml } from "@utils/helpers";
import { computed, onMounted, onUnmounted, ref } from "vue";

export interface TableOfContentsProps {
  headings: {
    content: string;
    level: number;
  }[];
  htmlElement?: string;
  tocId: string;
}

const { headings, htmlElement = "nav", tocId } = defineProps<TableOfContentsProps>();

const emit = defineEmits(["currentHeadline", "tocLinkClicked"]);

const activeHeadlineId = ref("");
const observer = ref<IntersectionObserver | null>(null);

// Computed once per headings change instead of re-parsing every heading on
// each render (every intersection change re-renders the whole list).
const items = computed(() =>
  headings.map((headline) => ({
    attrs: isHtml(headline.content)
      ? { textContent: getHtmlContent(headline.content) }
      : { innerHTML: headline.content },
    id: headingId(headline.content),
    level: headline.level,
  })),
);

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
    rootMargin: "0px 0px -60% 0px",
    threshold: 0,
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
