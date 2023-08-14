<template>
  <div v-if="header === selectedTabHeader" class="c-tab">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";

export interface TabProps {
  header: string;
}

defineProps<TabProps>();

const selectedTabHeader = inject("selectedTabHeader");
</script>

<style scoped></style>
