<template>
  <article
    v-for="(post, index) in posts.nodes"
    :key="index"
    class="c-post-card"
  >
    <a
      class="c-post-card__title-link"
      :href="'/' + post.language.slug + '/' + post.slug"
    >
      <h2 class="c-post-card__title">{{ post.title }}</h2>
    </a>
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

    <a
      class="c-post-card__read-more"
      :href="'/' + post.language.slug + '/' + post.slug"
    >
      <span>Read more</span>
      <ArrowRight
        :size="22"
        class="c-post-card__read-more-arrow"
      />
    </a>
    <!-- <div class="background" style="background-image: image-set()">
      <img
        v-if="post.featuredImage"
        :width="post.featuredImage.node.mediaDetails.width"
        :height="post.featuredImage.node.mediaDetails.height"
        :alt="post.featuredImage.node.altText"
        :src="post.featuredImage.node.mediaItemUrl"
        :srcset="post.featuredImage.node.srcSet"
        loading="eager"
        decoding="async"
        fetchpriority="high"
        class="c-blog__hero-image"
      >
    </div> -->
  </article>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
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
@use '@styles/components/post-card';
</style>
