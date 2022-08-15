<template>
  <div>
    <BookOpen/>
    <time>{{ time }}</time>Min
  </div>
</template>

<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'

const props = defineProps ({
  time: {
    type: Number,
    default: 0,
  },
})

</script>

<style scoped>

</style>