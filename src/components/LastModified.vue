<template>
  <time class="c-last-modified">{{ date }}</time>
</template>

<script setup lang="ts">

export interface LastModifiedProps {
  date: string;
}

const date = defineProps<LastModifiedProps>()
</script>

<style scoped>

</style>
