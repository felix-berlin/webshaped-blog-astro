<template>
  <div
    v-for="(category, index) in categories"
    :key="index"
    class="c-categories"
  >
    <p class="c-categories__item">
      {{ category.node.name }}
    </p>
  </div>
</template>

<script setup lang="ts">

interface Props {
  categories: {
    edges: [
      {
        node: {
          name: string;
          parent: object | null;
          children: {
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