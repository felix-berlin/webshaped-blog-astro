<template>
  <article
    v-for="(post, index) in posts.nodes"
    :key="index"
    class="c-post-card"
  >
    <a
      class="c-post-card__link"
      :href="'/' + post.language.slug + '/' + post.slug"
    >
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

      <div
        class="c-post-card__excerpt"
        v-html="post.excerpt"
      />

      <div
        class="c-post-card__read-more"
      >
        <span>{{ __(post.language.locale, 'blog.read_more') }}</span>
        <ArrowRight
          :size="22"
          class="c-post-card__read-more-arrow"
        />
      </div>
    </a>
  </article>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import Date from '@components/Date.vue'
import ReadingTime from '@components/ReadingTime.vue'
import CommentCount from '@components/comments/CommentCount.vue'
import HasTranslations from './HasTranslations.vue'
import { __ } from '@i18n/i18n'

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
          locale: string;
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
@use '@styles/components/post-card';
</style>
