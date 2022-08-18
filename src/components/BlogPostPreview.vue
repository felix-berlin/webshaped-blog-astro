<template>
  <article>
    <template
      v-for="(post, index) in posts"
      :key="index"
    >
      <a :href="post.node.slug">
        <h2>{{ post.node.title }}</h2>
      </a>
      <Date
        :date="post.node.dateGmt"
      />
      <div v-html="post.node.excerpt" />
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