<template>
  <div v-if="getYearDiff(date, Date.now()) >= showAfterYears" class="c-post-older-than">
    <!-- <p class="c-post-older-than__text">Dieser Post ist bereits {{ getYearDiff(date, Date.now()) }} alt. Möglicherweise ist der Inhalt nicht mehr ganz aktuell.</p> -->
    <p class="c-post-older-than__text">{{ __('de_DE', 'post_older_than.text', {count: getYearDiff(date, Date.now())}) }}</p>
  </div>
</template>

<script setup lang="ts">
import { __ } from '@i18n/i18n'

export interface PostOlderThanProps {
  date: string;
  showAfterYears: number;
}

const props = defineProps<PostOlderThanProps>()

const getYearDiff = (date1: string | number, date2: string | number) => {
  return Math.abs(new Date(date2).getFullYear() - new Date(date1).getFullYear());
}

</script>

<style scoped>

</style>
