<template>
  <article
    v-for="(post, index) in posts.nodes"
    :key="index"
    class="c-blog-card"
  >
    <a :href="'/' + post.language.slug + '/' + post.slug">
      <h2>{{ post.title }}</h2>
    </a>
    <Date
      :date="post.dateGmt"
    />

    <CommentCount
      :comment-total="post.commentCount"
      is-element="div"
    />

    <ReadingTime :time="post.seo.readingTime" />

    <HasTranslations
      v-if="post.translations && post.translations.length"
      :translations="post.translations"
    />

    <div v-html="post.excerpt" />
  </article>
</template>

<script setup lang="ts">
import Date from '@components/Date.vue'
import ReadingTime from '@components/ReadingTime.vue'
import CommentCount from '@components/comments/CommentCount.vue'
import HasTranslations from './HasTranslations.vue'

export interface BlogPostPreviewProps {
  posts: {
    nodes: [
      {
        dateGmt: string;
        modifiedGmt: string;
        slug: string;
        commentCount: number;
        excerpt: string;
        title: string;
        language: {
          slug: string;
        };
        featuredImage: object;
        translations: [];
        seo: {
          readingTime: number;
        };
      }
    ]
  };
}

const props = defineProps<BlogPostPreviewProps>()

</script>

<style lang="scss">
@use '@styles/components/blog-card';
</style>
