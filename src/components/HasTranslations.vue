<template>
  <div class="c-has-translation">
    <p class="c-has-translation__prefix-text">
      Diesen Post gibt es auch in:
    </p>
    <div
      v-for="(translation, index) in translations"
      :key="index"
      class="c-has-translation__translations"
    >
      <a
        :href="'/' + translation.language.slug + '/' + translation.slug"
        class="c-has-translation__link"
        :aria-label="`Blog in ${translation.language.name} lesen`"
      >
        <span :class="`c-has-translation__flag fi fi-${translation.language.slug === 'en' ? 'gb' : translation.language.slug}`" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import '/node_modules/flag-icons/css/flag-icons.min.css';

interface HasTranslationsProps {
  translations: [
    {
      commentCount: number;
      dateGtm: string;
      excerpt: string;
      featuredImage: {};
      language: {
        code: string;
        locale: string;
        name: string;
        slug: string;
      };
      modifiedGtm: string;
      seo: {
        readingTime: number;
      };
      slug: string;
      title: string;
    }
  ];
}

const props = defineProps<HasTranslationsProps>()

</script>

<style scoped>

</style>
