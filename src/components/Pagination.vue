<template>
  <nav v-if="page.lastPage > 1" class="c-pagination">
    <ul class="c-pagination__list u-list-reset">
      <li
        v-for="item in items"
        :key="item.key"
        :class="[
          'c-pagination__item',
          { 'is-disabled': item.disabled, 'is-current': item.current },
        ]"
      >
        <component
          :is="item.disabled ? 'span' : 'a'"
          :href="item.disabled ? undefined : item.href"
          :aria-label="item.label"
          class="c-pagination__link"
        >
          <component :is="item.icon" v-if="item.icon" />
          <template v-else>{{ item.key }}</template>
        </component>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";
import type { Page } from "astro";
import type { Component } from "vue";

import { categoryPathBuilder } from "@utils/i18n/utils";
import ChevronFirst from "virtual:icons/lucide/chevron-first";
import ChevronLast from "virtual:icons/lucide/chevron-last";
import ChevronLeft from "virtual:icons/lucide/chevron-left";
import ChevronRight from "virtual:icons/lucide/chevron-right";
import { computed } from "vue";

import { useI18n } from "@/composables/useI18n";

interface PaginationItem {
  current?: boolean;
  disabled?: boolean;
  href?: string;
  icon?: Component;
  key: number | string;
  label?: string;
}

const { lang, page, slug } = defineProps<{
  lang: Lang;
  page: Page;
  /** Category slug; links are built with `categoryPathBuilder`. */
  slug: string;
}>();

const { t } = useI18n(() => lang);

const pageHref = (index: number) => categoryPathBuilder(slug, lang, String(index));

const items = computed<PaginationItem[]>(() => {
  const { currentPage, lastPage, url } = page;

  return [
    {
      disabled: currentPage === 1,
      href: pageHref(1),
      icon: ChevronFirst,
      key: "first",
      label: t.value("pagination.first"),
    },
    {
      disabled: !url.prev,
      href: url.prev,
      icon: ChevronLeft,
      key: "prev",
      label: t.value("pagination.previous"),
    },
    ...Array.from({ length: lastPage }, (_, i) => ({
      current: i + 1 === currentPage,
      href: pageHref(i + 1),
      key: i + 1,
    })),
    {
      disabled: !url.next,
      href: url.next,
      icon: ChevronRight,
      key: "next",
      label: t.value("pagination.next"),
    },
    {
      disabled: currentPage === lastPage,
      href: pageHref(lastPage),
      icon: ChevronLast,
      key: "last",
      label: t.value("pagination.last"),
    },
  ];
});
</script>

<style lang="scss">
@use "@styles/components/pagination";
</style>
