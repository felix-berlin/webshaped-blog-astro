<template>
  <div
    v-if="target"
    class="c-webmentions"
  >
    My Webmention's

    <template
      v-for="(mention, index) in state.mentions"
      :key="index"
    >
      <div
        class="c-webmentions__item"
      >
        <a :href="mention.author.url">
          <img
            :src="mention.author.photo"
            :alt="mention.author.name"
            loading="lazy"
            decoding="async"
          >
        </a>
        <div v-text="mention.content.text" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';

export interface WebmentionsProps {
  target?: string;
  currentUrl?: boolean;
}

const props = withDefaults(defineProps<WebmentionsProps>(), {
  target: '',
  currentUrl: false,
});

const state = reactive({
  mentions: [],
})

const getWebmentions = async (target = props.target) => {
  if (props.currentUrl) {
    target = window.location.href;
  }

  const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${target}`)
  const data = await response.json()
  console.log(data);

  state.mentions = data.children
}

onMounted(() => {
  getWebmentions();
});
</script>

<style scoped>

</style>
