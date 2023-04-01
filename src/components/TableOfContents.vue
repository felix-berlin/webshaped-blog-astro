<template>
  <nav
    :id="tocId"
    class="c-toc"
  >
    <template
      v-for="(headline, index) in headings"
      :key="index"
    >
      <a
        :href="`#${slugify(JSON.parse(headline.attributesJSON).content, { lower: true })}`"
        :class="[`c-toc__link c-toc__link--depth-${JSON.parse(headline.attributesJSON).level}`, { 'is-active': activeHeadline === slugify(JSON.parse(headline.attributesJSON).content, { lower: true }) }]"
      >{{ JSON.parse(headline.attributesJSON).content }}</a>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import slugify from 'slugify';

export interface TableOfContentsProps {
  headings: [
    {
      attributesJSON: string;
    },
  ]
}

const props = defineProps<TableOfContentsProps>()

const tocId = 'tableOfContents';

const activeHeadline = ref('');

const observer = ref<IntersectionObserver>();

observer.value = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const headline = entry.target as HTMLElement;
      activeHeadline.value = headline.id;
    }
  });
}, {
  threshold: 0.75,
  rootMargin: '-10% 0px',
});

onMounted(() => {
  if (observer.value) document.querySelectorAll('.c-blocks h2[id], .c-blocks h3[id]').forEach(section => observer.value.observe(section));
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect();
})
</script>

<style lang="scss">
@use '@styles/components/table-of-contents.scss';
</style>
