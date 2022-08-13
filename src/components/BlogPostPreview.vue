<template>
  <article>
    <template v-for="post in posts">
      <a :href="`/posts/${post.node.slug}`">
        <h2>{{ post.node.title }}</h2>
      </a>
      <time v-text="post.node.dateGmt" />
      <div v-html="post.node.excerpt"></div>
    </template>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { formatDate } from '../lib/prototypes'

export default defineComponent ({
  name: 'BlogPostPreview',

  props: {
    posts: {
      default: () => {},
      type: Object,
    },
  },

  data() {
    return {
      allPosts: {},
    }
  },
})
</script>