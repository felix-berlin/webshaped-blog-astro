<template>
  <div>
    <p>{{ test.name }}</p>
    <div
      v-for="(mention, index) in state.mentions"
      :key="index"
      class="c-webmentions"
    >
      <div
        class="c-webmentions__item"
      >
        <a
          :href="mention.author.url"
          target="_blank"
        >
          <img
            :src="mention.author.photo"
            :alt="mention.author.name"
            loading="lazy"
            decoding="async"
          >
        </a>
        <div v-text="mention.content.text" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { onMounted, reactive } from 'vue';
import { useStore } from '@nanostores/vue';
import { currentWebmentionsCount } from '@stores/store';

export interface WebmentionsProps {
  target?: string;
  currentUrl?: boolean;
}
const loadUserData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'Matt Maribojoc',
        pic:
          'https://cdn-images-1.medium.com/fit/c/100/100/2*EcZb9cndrhTF7_d74dv2Fg.png',
        bio:
          'I run a VueJS community over at https://learnvue.co, develop web sites, and post whatever I find cool on the Internet.',
      })
    }, 5000)
  })
}
const props = withDefaults(defineProps<WebmentionsProps>(), {
  target: '',
  currentUrl: false,
});

const state = reactive({
  mentions: [],
})

const test = await loadUserData()
// const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${props.target}`)
//                 .then((res) => res.json())
//                 .then((data) => {
//                   currentWebmentionsCount.set(data.children.length);
//                   state.mentions = data.children;
//                 });

// const getWebmentions = async (target = props.target) => {
//   if (props.currentUrl) {
//     target = window.location.href;
//   }

//   const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${target}`)
//   const data = await response.json()
//   console.log('Webmentions', data);
//   currentWebmentionsCount.set(data.children.length);
//   state.mentions = data.children;
// }

// onMounted( async () => {
//   await getWebmentions();
//   console.log(useStore(currentWebmentionsCount));
// });
</script>

<style scoped>

</style>
