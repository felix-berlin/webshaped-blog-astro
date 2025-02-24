<template>
  <nav v-if="page.lastPage > 1" class="c-pagination">
    <ul class="c-pagination__list u-list-reset">
      <li :class="['c-pagination__item', { 'is-disabled': 1 === page.currentPage }]">
        <component
          :is="1 === page.currentPage ? 'span' : 'a'"
          :href="`${path}/${page.start}`"
          :aria-label="t('pagination.first')"
          class="c-pagination__link"
        >
          <ChevronFirst />
        </component>
      </li>
      <li :class="['c-pagination__item', { 'is-disabled': !page.url.prev }]">
        <component
          :is="page.url.prev ? 'a' : 'span'"
          :href="page.url.prev"
          :aria-label="t('pagination.previous')"
          class="c-pagination__link"
        >
          <ChevronLeft />
        </component>
      </li>

      <li
        v-for="index in page.lastPage"
        :key="index"
        :class="['c-pagination__item', { 'is-current': index === page.currentPage }]"
      >
        <a :href="`${path}/${index}`" class="c-pagination__link">{{ index }}</a>
      </li>
      <li :class="['c-pagination__item', { 'is-disabled': !page.url.next }]">
        <component
          :is="page.url.next ? 'a' : 'span'"
          :href="page.url.next"
          :aria-label="t('pagination.next')"
          class="c-pagination__link"
        >
          <ChevronRight />
        </component>
      </li>
      <li :class="['c-pagination__item', { 'is-disabled': page.lastPage === page.currentPage }]">
        <component
          :is="page.lastPage === page.currentPage ? 'span' : 'a'"
          :href="`${path}/${page.lastPage}`"
          :aria-label="t('pagination.last')"
          class="c-pagination__link"
        >
          <ChevronLast />
        </component>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import ChevronLeft from "virtual:icons/lucide/chevron-left";
import ChevronRight from "virtual:icons/lucide/chevron-right";
import ChevronFirst from "virtual:icons/lucide/chevron-first";
import ChevronLast from "virtual:icons/lucide/chevron-last";
import { useTranslations } from "@utils/i18n/utils";
import type { Page } from "astro/dist/@types/astro";
import type { Language, Maybe } from "@ts_types/generated/graphql";
import { currentLanguage } from "@stores/store";
import { useStore } from "@nanostores/vue";

defineProps<{
  page: Page;
  path: string;
  lang: Maybe<Language>;
}>();

const lang = useStore(currentLanguage);
const t = useTranslations(lang.value);
</script>

<style lang="scss">
@use "@styles/components/pagination";
</style>
