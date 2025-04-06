<template>
  <div v-if="categories && categories.edges[0].node.name !== 'Uncategorized'" class="c-categories">
    <p class="c-categories__headline">{{ t("categories") }}</p>
    <div class="c-categories__item-wrap">
      <template v-for="(category, index) in categories.edges" :key="category.node.id">
        <a :href="categoryPathBuilder(category?.node?.slug, lang)" class="c-categories__link">
          {{ category.node.name }}
        </a>
        <template v-if="index !== categories.edges.length - 1">, </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RootQueryToCategoryConnection } from "@ts_types/generated/graphql";
import { useTranslations, categoryPathBuilder } from "@utils/i18n/utils";

interface Props {
  categories: RootQueryToCategoryConnection;
  lang: string;
}

const { categories, lang } = defineProps<Props>();
const t = useTranslations(lang);
</script>
