<template>
  <article>
    <template v-for="post in posts">
      <a :href="post.node.slug">
        <h2>{{ post.node.title }}</h2>
      </a>
      <Date :date="post.node.dateGmt" client:visible></Date>
      <div v-html="post.node.excerpt"></div>
    </template>
  </article>
</template>

<script setup lang="ts">
import Date from '../components/Date.vue'

interface Props {
  posts: object;
}

const props = defineProps<Props>()

</script>