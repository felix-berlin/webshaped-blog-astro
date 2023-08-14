<template>
  <section class="c-comments">
    <h2>{{ __(lang?.locale!, "comments.headline") }}</h2>

    <CreateComment :current-post-id="currentPostId" :lang="lang" />

    <p v-if="!comments.nodes?.length">
      {{ __(lang?.locale!, "comments.no_comments") }}
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
import CreateComment from "@components/comments/CreateComment.vue";
import { __ } from "@i18n/i18n";
import type { Language, Comment, Maybe } from "@ts_types/generated/graphql";

export interface CommentsProps {
  comments: {
    nodes?: [Comment];
  };
  currentPostId: number;
  id?: string;
  authorId: string;
  lang: Maybe<Language>;
}

defineProps<CommentsProps>();
</script>

<style lang="scss">
@use "@styles/components/comments";
</style>
