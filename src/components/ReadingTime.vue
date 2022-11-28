<template>
  <div class="c-reading-time" title="Lesezeit">
    <BookOpen
      aria-hidden="true"
      focusable="false"
      class="c-reading-time__icon"
      :size="18"
    />
    <time class="c-reading-time__time">{{ time }}</time>Min
  </div>
</template>

<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'

export interface ReadingTimeProps {
  time: number | undefined;
}

const props = defineProps<ReadingTimeProps>()

</script>

<style scoped>

</style>
