<template>
  <article>
    <template
      v-for="(post, index) in posts.nodes"
      :key="index"
    >
      <a :href="'/' + post.slug">
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

      <div v-html="post.excerpt" />
    </template>
  </article>
</template>

<script setup lang="ts">
import Date from '@components/Date.vue'
import ReadingTime from '@components/ReadingTime.vue'
import CommentCount from '@components/CommentCount.vue'

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
        language: object;
        featuredImage: object;
        seo: {
          readingTime: number;
        };
      }
    ]
  };
}

const props = defineProps<BlogPostPreviewProps>()

</script>
