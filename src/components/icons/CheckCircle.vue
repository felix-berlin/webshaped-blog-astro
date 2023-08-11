<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="c-circle-icon c-circle-icon--success"
  >
    <path
      class="c-circle-icon__circle"
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
    />
    <path class="c-circle-icon__check" d="m9 12 2 2 4-4" />
  </svg>
</template>

<script setup lang="ts">
export interface CheckCircleProps {
  type?: "success" | "error";
}

defineProps<CheckCircleProps>();
</script>

<style lang="scss">
@use "@styles/components/circle-icon";
</style>
