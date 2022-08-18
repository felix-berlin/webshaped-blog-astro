<template>
  <div class="c-comment">
    <article :id="'Comment' + comment.commentId" class="c-comment__item">
      <header class="c-comment__header">
        <img :src="comment.author.node.avatar.url" alt="" :width="comment.author.node.avatar.width" :height="comment.author.node.avatar.height" class="c-comment__image">
        <h2>{{ comment.author.node.name }}</h2>
      </header>
      <main v-html="comment.content" class="c-comment__content"></main>
      <footer class="c-comment__footer">
        <Date :date="comment.dateGmt" class="c-comment__date"></Date>
      </footer>
    </article>
    <div v-for="(reply, index) in comment.replies.nodes" :key="index" v-if="comment.replies">
      <CommentItem :comment="reply" ></CommentItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import Date from '../components/Date.vue';

interface Props {
  comment: {
    content: string;
    dateGmt: string;
    id: string;
    parentId: string;
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
    replies: {
      nodes: [];
    }
  };
}

const props = defineProps<Props>()
</script>

<style scoped>

</style>