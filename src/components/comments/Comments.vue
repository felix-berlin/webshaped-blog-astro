<template>
  <section class="c-comments">
    <h2>{{ t("comments.headline") }}</h2>

    <CreateComment :current-post-id="currentPostId" :lang="lang" />

    <p v-if="!comments.nodes?.length">
      {{ t("comments.no_comments") }}
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
import { useTranslations } from "@utils/i18n/utils";
import type { Comment } from "@ts_types/generated/graphql";

export interface CommentsProps {
  comments: {
    nodes?: [Comment];
  };
  currentPostId: number;
  id?: string;
  authorId: string;
  lang: string;
}

const { comments, currentPostId, id, authorId, lang } = defineProps<CommentsProps>();
const t = useTranslations(lang);
</script>

<style lang="scss">
@use "@styles/components/comments/comments";
</style>
