<template>
  <section class="c-comments">
    <h2>{{ __(lang.locale, "comments.headline") }}</h2>

    <CreateComment :current-post-id="currentPostId" :lang="lang" />

    <p v-if="!comments.nodes?.length">
      {{ __(lang.locale, "comments.no_comments") }}
    </p>

    <template v-for="comment in comments.nodes" :key="comment.id">
      <CommentItem
        :comment="comment"
        :depth="0"
        :author-id="authorId"
        :lang="lang"
        :current-post-id="currentPostId"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import CommentItem from "@components/comments/CommentItem.vue";
import type { CommentData } from "@components/comments/CommentItem.vue";
import CreateComment from "@components/comments/CreateComment.vue";
import { __ } from "@i18n/i18n";

export interface CommentsProps {
  comments: {
    nodes?: [CommentData];
  };
  currentPostId: number;
  id?: string;
  authorId: string;
  lang: {
    locale: string;
  };
}

const props = defineProps<CommentsProps>();
</script>

<style lang="scss">
@use "@styles/components/comments";
</style>
