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
    <div v-for="(reply, index) in comment.replies.nodes" :key="index" v-if="comment.replies" class="HIER">
      <CommentItem :comment="reply" ></CommentItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import Date from '../components/Date.vue';

const props = defineProps ({
  comment: {
    type: Object,
    default: () => {},
    required: true,
  },
})
</script>

<style scoped>

</style>