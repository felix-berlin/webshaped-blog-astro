<template>
  <nav
    v-if="page.lastPage > 1"
    class="c-pagination"
  >
    <ul class="c-pagination__list u-list-reset">
      <li
        :class="['c-pagination__item', { 'is-disabled': 1 === page.currentPage }]"
      >
        <component
          :is="1 === page.currentPage ? 'span' : 'a'"
          :href="`${path}/${page.start}`"
          :aria-label="__(lang.locale, 'pagination.first')"
          class="c-pagination__link"
        >
          <ChevronFirst />
        </component>
      </li>
      <li
        :class="['c-pagination__item', { 'is-disabled': !page.url.prev }]"
      >
        <component
          :is="page.url.prev ? 'a' : 'span'"
          :href="page.url.prev"
          :aria-label="__(lang.locale, 'pagination.previous')"
          class="c-pagination__link"
        >
          <ChevronLeft />
        </component>
      </li>

      <li
        v-for="index in page.lastPage"
        :key="index"
        :class="['c-pagination__item', { 'is-current': index === page.currentPage},]"
      >
        <a
          :href="`${path}/${index}`"
          class="c-pagination__link"
        >{{ index }}</a>
      </li>
      <li
        :class="['c-pagination__item', { 'is-disabled': !page.url.next }]"
      >
        <component
          :is="page.url.next ? 'a' : 'span'"
          :href="page.url.next"
          :aria-label="__(lang.locale, 'pagination.next')"
          class="c-pagination__link"
        >
          <ChevronRight />
        </component>
      </li>
      <li
        :class="['c-pagination__item', { 'is-disabled': page.lastPage === page.currentPage }]"
      >
        <component
          :is="page.lastPage === page.currentPage ? 'span' : 'a'"
          :href="`${path}/${page.lastPage}`"
          :aria-label="__(lang.locale, 'pagination.last')"
          class="c-pagination__link"
        >
          <ChevronLast />
        </component>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from 'lucide-vue-next';
import { __ } from '@i18n/i18n';
import type { Page } from 'astro/dist/@types/astro';
const props = defineProps<{
  page: Page;
  path: string;
  lang: {
    locale: string;
  };
}>();
</script>

<style lang="scss">
@use '@styles/components/pagination'
</style>
