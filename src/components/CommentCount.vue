<template>
  <component
    :is="isElement"
    class="c-comment-count"
  >
    <span class="c-comment-count__icon">
      <MessageSquare />
    </span>
    <span class="c-comment-count__count">{{ commentTotal ? commentTotal : 0 }}</span>
  </component>
</template>

<script setup lang="ts">
import { MessageSquare } from 'lucide-vue-next'

interface Props {
  commentTotal: number | null;
  isElement: string;
}

const { commentTotal, isElement = 'div'} = defineProps<Props>()
</script>

<style scoped>

</style>