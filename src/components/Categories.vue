<template>
  <template v-if="categories.edges[0].node.name !== 'Uncategorized'">
    <div
      v-for="(category, index) in categories.edges"
      :key="index"
      class="c-categories"
    >
      <Hash :size="18"></Hash>
      <a :href="`/category/${category.node.name}`" class="c-categories__item">
        {{ category.node.name }}
      </a>
    </div>
  </template>
</template>

<script setup lang="ts">
import { Hash } from 'lucide-vue-next'

interface Props {
  categories: {
    edges?: [
      {
        node: {
          name: string;
          parent: object | null;
          children?: {
            edges: [];
          }
        }
      }
    ]
  };
}

const props = defineProps<Props>()
</script>

<style scoped>

</style>
