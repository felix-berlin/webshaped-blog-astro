<template>
  <div
    v-if="categories && categories.edges[0].node.name !== 'Uncategorized'"
    class="c-categories"
  >
    <div
      v-for="category in categories.edges"
      :key="category.node.id"
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
  categories: RootQueryToCategoryConnection;
}

defineProps<Props>();
</script>
