<template>
  <div class="c-reading-time" :title="__(lang.locale, 'reading_time.title')">
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
import { __ } from '@i18n/i18n'

export interface ReadingTimeProps {
  time: number | undefined;
  lang: {
    locale: string;
  };
}

const props = defineProps<ReadingTimeProps>()



</script>

<style scoped>

</style>
