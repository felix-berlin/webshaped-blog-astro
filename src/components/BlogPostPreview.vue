<template>
  <article v-for="(post, index) in posts" :key="index" class="c-post-card">
    <a class="c-post-card__link" :href="postLink(post)">
      <h2 class="c-post-card__title">{{ post.title }}</h2>

      <!-- <Date
      :date="post.dateGmt"
    /> -->

      <!-- <CommentCount
      :comment-total="post.commentCount"
      is-element="div"
    /> -->

      <!-- <ReadingTime :time="post.seo.readingTime" /> -->

      <!-- <HasTranslations
      v-if="post.translations && post.translations.length"
      :translations="post.translations"
    /> -->

      <div class="c-post-card__excerpt" v-html="post.excerpt" />

      <div class="c-post-card__read-more">
        <span>{{ t("blog.read_more") }}</span>
        <ArrowRight width="22" height="22" class="c-post-card__read-more-arrow" />
      </div>
    </a>
  </article>
</template>

<script setup lang="ts">
import ArrowRight from "virtual:icons/lucide/arrow-right";
import Date from "@components/post/Date.vue";
import ReadingTime from "@components/post/ReadingTime.vue";
import CommentCount from "@components/comments/CommentCount.vue";
import HasTranslations from "./HasTranslations.vue";
import { useTranslations } from "@utils/i18n/utils";
import type { Post } from "@ts_types/generated/graphql";

export interface BlogPostPreviewProps {
  posts: Array<Post>;
}

const { posts } = defineProps<BlogPostPreviewProps>();
const t = useTranslations(posts[0]?.language?.locale);

const postLink = (post: Post): string => {
  return `/${post?.language?.slug}/posts/${post.slug}`;
};
</script>

<style lang="scss">
@use "@styles/components/post-card";
</style>
