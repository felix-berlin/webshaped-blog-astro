<template>
  <section class="c-comments">
    <h2>{{ t("comments") }}</h2>

    <CreateComment :current-post-id="currentPostId" :lang="lang" />

    <p v-if="!comments.nodes?.length">
      {{ t("comments.no_comments") }}
    </p>

    <template
      v-for="comment in comments.nodes"
      :key="useFragment(CommentFieldsFragmentDoc, comment).id"
    >
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

import type { CommentNode } from "@components/comments/CommentItem.vue";

import { useFragment } from "@/gql/fragment-masking";
import { CommentFieldsFragmentDoc } from "@/gql/graphql.ts";

export interface CommentsProps {
  authorId: string;
  comments: {
    nodes?: [CommentNode];
  };
  currentPostId: string;
  id?: string;
  lang: string;
}

const { authorId, comments, currentPostId, id, lang } = defineProps<CommentsProps>();
const t = useTranslations(lang as "de" | "en");
</script>

<style lang="scss">
@use "@styles/components/comments/comments";
</style>
