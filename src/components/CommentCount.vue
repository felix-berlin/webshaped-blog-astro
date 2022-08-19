<template>
  <component
    :is="isElement"
    class="c-comment-count"
  >
    <span class="c-comment-count__icon">
      <MessageSquare />
    </span>
    <span
      v-if="commentTotal"
      class="c-comment-count__count"
    >{{ commentTotal }}</span>
    <span
      v-else
      class="c-comment-count__count 2"
    >0</span>
  </component>
</template>

<script setup lang="ts">
import { MessageSquare } from 'lucide-vue-next'

interface CommentCountProps {
  commentTotal: number | null;
  isElement?: string;
}

const { commentTotal, isElement = 'div'} = defineProps<CommentCountProps>()
</script>

<style scoped>

</style>
