<template>
  <div>
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

interface State {
  mentions: [
    {
      author: {
        name: string;
        photo: string;
        url: string;
        type: string;
      },
      content: {
        html: string;
        text: string;
      },
      'mention-of': string;
      published: string;
      type: string;
      url: string;
      'wm-id': number;
      'wm-private': boolean;
      'wm-property': string;
      'wm-received': string;
      'wm-source': string;
      'wm-target': string;
    }
  ];
}

const props = withDefaults(defineProps<WebmentionsProps>(), {
  target: '',
  currentUrl: false,
});

const state: State = reactive({
  mentions: [],
})

/**
 * Fetch all webmentions for the current page
 *
 * @var {[type]}
 */
const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${props.target}`)
                .then((res) => res.json())
                .then(async (data) => {
                  // TODO: Remove or comment out. This is just for testing.
                  await new Promise(resolve => setTimeout(resolve, 5000));
                  currentWebmentionsCount.set(data.children.length);
                  state.mentions = data.children;
                });

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
