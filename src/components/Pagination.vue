<template>
  <nav class="c-pagination">
    <ul>
      <li
        v-if="1 !== page.currentPage"
        class="c-pagination__item"
      >
        <a
          :href="`${path}/${page.start}`"
          :aria-label="__(lang.locale, 'pagination.first')"
        >
          <ChevronFirst />
        </a>
      </li>
      <li
        v-if="page.url.prev"
        class="c-pagination__item"
      >
        <a
          :href="page.url.prev"
          :aria-label="__(lang.locale, 'pagination.previous')"
        ><ChevronLeft /></a>
      </li>

      <li
        v-for="index in page.total"
        :key="index"
        :class="['c-pagination__item', { 'is-current': index === page.currentPage},]"
      >
        <a :href="`${path}/${index}`">{{ index }}</a>
      </li>
      <li
        v-if="page.url.next"
        class="c-pagination__item"
      >
        <a
          :href="page.url.next"
          :aria-label="__(lang.locale, 'pagination.next')"
        ><ChevronRight /></a>
      </li>
      <li
        v-if="page.total !== page.currentPage"
        class="c-pagination__item"
      >
        <a
          :href="`${path}/${page.total}`"
          :aria-label="__(lang.locale, 'pagination.last')"
        ><ChevronLast /></a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from 'lucide-vue-next';
import { __ } from '@i18n/i18n'
const props = defineProps<{
  page: {
    currentPage: number;
    total: number;
    start: number;
    url: {
      prev: string;
      next: string;
    };
  };
  path: string;
  lang: {
    locale: string;
  };
}>();
</script>

<style scoped>

</style>
