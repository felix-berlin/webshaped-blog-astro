<template>
  <component :is="htmlElement" :id="tocId" class="c-toc">
    <a
      v-for="item in headings"
      :key="item.id"
      :href="`#${item.id}`"
      :class="[
        `c-toc__link c-toc__link--depth-${item.level}`,
        { 'is-active': activeHeadlineId === item.id },
      ]"
      v-bind="item.linkAttrs"
      @click="emit('tocLinkClicked')"
    />
  </component>
</template>

<script setup lang="ts">
import type { TocHeading } from "@services/fragments/blockFragments";

import { onMounted, onUnmounted, ref } from "vue";

export interface TableOfContentsProps {
  headings: TocHeading[];
  htmlElement?: string;
  tocId: string;
}

const { headings, htmlElement = "nav", tocId } = defineProps<TableOfContentsProps>();

const emit = defineEmits<{ currentHeadline: [text: null | string]; tocLinkClicked: [] }>();

const activeHeadlineId = ref("");
let observer: IntersectionObserver | undefined;

/** Marks the heading that just scrolled into the top 40% of the viewport as active. */
const handleIntersect = (entries: IntersectionObserverEntry[]): void => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    activeHeadlineId.value = entry.target.id;
    emit("currentHeadline", entry.target.textContent);
  });
};

onMounted(() => {
  observer = new IntersectionObserver(handleIntersect, {
    rootMargin: "0px 0px -60% 0px",
    threshold: 0,
  });
  document
    .querySelectorAll(".c-blog__post h2[id], .c-blog__post h3[id]")
    .forEach((section) => observer?.observe(section));
});

onUnmounted(() => observer?.disconnect());
</script>

<style lang="scss">
@use "@styles/components/table-of-contents.scss";
</style>
