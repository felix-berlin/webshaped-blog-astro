<template>
  <div>
    <BookOpen />
    <time>{{ time }}</time>Min
  </div>
</template>

<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'

export interface ReadingTimeProps {
  time: number;
}

const props = defineProps<ReadingTimeProps>()

</script>

<style scoped>

</style>