<template>
  <component :is="props.isElement" class="c-comment-count">
    <span class="c-comment-count__icon">
      <MessageSquare />
    </span>
    <span class="c-comment-count__count">{{ props.commentTotal }}</span>
  </component>
</template>

<script setup lang="ts">
import { MessageSquare } from "lucide-vue-next";

interface CommentCountProps {
  commentTotal: number | null;
  isElement?: string;
  href?: string;
}

const props = withDefaults(defineProps<CommentCountProps>(), {
  commentTotal: 0,
  isElement: "div",
  href: "",
});
</script>
