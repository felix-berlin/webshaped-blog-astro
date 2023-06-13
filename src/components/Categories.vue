<template>
  <div
    v-if="categories ?? categories.edges[0].node.name !== 'Uncategorized'"
    class="c-categories"
  >
    <div
      v-for="(category, index) in categories.edges"
      :key="index"
      class="c-categories__item"
    >
      <Hash :size="18" />
      <a
        :href="`/category/${category?.node?.name?.toLowerCase()}/1`"
        class="c-categories__link"
      >
        {{ category.node.name }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Hash } from "lucide-vue-next";
import type { RootQueryToCategoryConnection } from "../types/generated/graphql";

interface Props {
  categories: {
    edges?: RootQueryToCategoryConnection["edges"];
  };
}

const props = defineProps<Props>();
</script>

<style scoped></style>
