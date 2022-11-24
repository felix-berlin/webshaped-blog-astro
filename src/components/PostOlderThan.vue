<template>
  <div v-if="getYearDiff(date, Date.now()) >= showAfterYears" class="c-post-older-than">
    <p class="c-post-older-than__text">Dieser Post ist bereits {{ getYearDiff(date, Date.now()) }} alt. Möglicherweise ist der Inhalt nicht mehr ganz aktuell.</p>
  </div>
</template>

<script setup lang="ts">
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
