<template>
  <div class="c-webmentions">
    My Webmention's

    <template
      v-for="(mention, index) in data.mentions"
      :key="index"
    >
      <div
        class="c-webmentions__item"
      >
        <a :href="mention.author.url">
          <img
            :src="mention.author.photo"
            :alt="mention.author.name"
          >
        </a>
        <div v-text="mention.content.text" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const data = {
  mentions: [],
}

const getWebmentions = async () => {
  const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${window.location.href}`)
  const data = await response.json()
  console.log(data);

  data.mentions = data.children
}

onMounted(() => {
  getWebmentions();
});
</script>

<style scoped>

</style>
