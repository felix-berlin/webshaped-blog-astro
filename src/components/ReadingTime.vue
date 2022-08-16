<template>
  <div>
    <BookOpen/>
    <time>{{ time }}</time>Min
  </div>
</template>

<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'

interface Props {
  time: number;
}

const props = defineProps<Props>()

</script>

<style scoped>

</style>