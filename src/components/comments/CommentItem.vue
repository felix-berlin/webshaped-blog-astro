<template>
  <div
    class="c-comment"
    :class="[
      `is-level-${depth} ${isOdd(depth) ? 'is-odd': 'is-even'}`,
      {
      'is-reply': !comment?.replies?.nodes?.length,
      }]"
    role="comment"
  >
    <article
      :id="'comment-' + comment.id"
      class="c-comment__item"
      :style="itemStyling(depth)"
    >
      <header class="c-comment__header">
        <img
          v-if="comment.author?.node?.avatar"
          :src="comment.author.node.avatar.url"
          alt=""
          :width="comment.author.node.avatar.width"
          :height="comment.author.node.avatar.height"
          class="c-comment__author-image"
        >
        <h2 class="c-comment__author-name">{{ comment.author.node.name }}</h2>
      </header>
      <main class="c-comment__content">
        <a v-if="comment.parentId" :href="`#comment-${comment.parentId}`" class="c-comment__reply-to">Reply to</a>
        <p class="c-comment__text" v-html="comment.content"></p>
        <footer class="c-comment__footer">
          <Date
            :date="comment.dateGmt"
            class="c-comment__date"
          />
        </footer>
      </main>
    </article>

    <template
      v-if="comment.replies"
      v-for="(reply, index) in comment.replies.nodes"
      :key="index"
    >
      <CommentItem :comment="reply" :depth="depth + 1" :author-id="authorId" />

    </template>

  </div>
</template>

<script setup lang="ts">
import Date from '@components/Date.vue';
import { computed } from 'vue';

export interface CommentData {
  content: string;
  dateGmt: string;
  id: string;
  parentId?: string | null;
  commentId: number;
  author: {
    node: {
      name: string;
      id: string;
      avatar?: {
        url?: string;
        width?: number;
        height?: number;
      }
    }
  }
  replies?: {
    nodes: [];
  }
}

interface CommentItemProps {
  comment: CommentData;
  depth: number;
  authorId?: string;
}

const props = defineProps<CommentItemProps>()

const isAuthor = computed(() => props.comment.author.node.id === props.authorId);

const isOdd = (num: number) => num % 2;

const itemStyling = (depth: number) => {
  const spacing = 121;

  if (!isOdd(depth) && depth > 0) {
    return { 'margin': `0 ${depth / 2 * spacing}px`};
  }

  if (isOdd(depth)) {
    if (depth === 1) return {'margin-left': `${depth * spacing}px`};
    else return {'margin': `0 ${spacing}px 0 ${depth / 1.5 * spacing}px`};
  }
}
</script>

<style lang="scss">
@use '@styles/components/comment';
</style>
