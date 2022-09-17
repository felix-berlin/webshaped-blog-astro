<template>
  <div class="c-comment">
    <article
      :id="'Comment' + comment.commentId"
      class="c-comment__item"
    >
      <header class="c-comment__header">
        <img
          :src="comment.author.node.avatar.url"
          alt=""
          :width="comment.author.node.avatar.width"
          :height="comment.author.node.avatar.height"
          class="c-comment__image"
        >
        <h2>{{ comment.author.node.name }}</h2>
      </header>
      <main
        class="c-comment__content"
        v-html="comment.content"
      />
      <footer class="c-comment__footer">
        <Date
          :date="comment.dateGmt"
          class="c-comment__date"
        />
      </footer>
    </article>
    <template v-if="comment.replies">
      <div
        v-for="(reply, index) in comment.replies.nodes"

        :key="index"
      >
        <CommentItem :comment="reply" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import Date from '@components/Date.vue';

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
      avatar: {
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
}

const props = defineProps<CommentItemProps>()
</script>

<style scoped>

</style>
