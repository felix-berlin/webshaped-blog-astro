<template>
  <article>
    <template v-for="post in posts">
      <a :href="`/posts/${post.node.slug}`">
        <h2>{{ post.node.title }}</h2>
      </a>
      <Date :date="post.node.dateGmt"></Date>
      <div v-html="post.node.excerpt"></div>
    </template>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Date from '../components/Date.vue'

export default defineComponent ({
  name: 'BlogPostPreview',

  components: {
    Date,
  },

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