<template>
  <Date :date="date" :lang="lang">
    <template #before>
      <Calendar :size="18"></Calendar>
    </template>
  </Date>
</template>

<script setup lang="ts">
import Date from '@components/Date.vue';
import { Calendar } from 'lucide-vue-next'

export interface DateModifiedProps {
  date: string;
  lang?: {
    locale: string;
  };
}

const props = defineProps<DateModifiedProps>()

</script>

<style scoped>

</style>
