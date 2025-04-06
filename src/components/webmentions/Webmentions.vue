<template>
  <div>
    <div class="c-webmentions" v-if="webmentionsCount > 0">
      <WebmentionsItem
        v-for="(mention, index) in state.mentions"
        :key="mention['wm-id']"
        :mention="mention"
        :index="index"
      />
    </div>
    <NoMentions v-if="webmentionsCount === 0" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useStore } from "@nanostores/vue";
import { currentWebmentionsCount } from "@stores/store";
import WebmentionsItem from "@components/webmentions/WebmentionsItem.vue";
import NoMentions from "@components/webmentions/NoMentions.vue";
import type { Webmention } from "@components/webmentions/WebmentionsItem.vue";
/**
 * Everything about Webmentions
 *
 * @see https://webmention.io/
 * Good read: @see https://daily-dev-tips.com/posts/goodbye-comments-welcome-webmentions/
 * Social mentions provider: @see https://brid.gy/
 */

export interface WebmentionsProps {
  target?: string;
  currentUrl?: boolean;
}

interface Webmentions {
  mentions: Webmention[];
}

const { target = "", currentUrl = false } = defineProps<WebmentionsProps>();

const state: Webmentions = reactive({
  mentions: [],
});

const webmentionsCount = useStore(currentWebmentionsCount);

/**
 * Fake delay for testing purposes
 *
 *
 * @var {[type]}
 */
// TODO: Remove or comment out. This is just for testing.
// await fetch(`https://webmention.io/api/mentions.jf2?target=${target}`)
//   .then((res) => res.json())
//   .then(async (data) => {
//     await new Promise((resolve) => setTimeout(resolve, 3000));

//     currentWebmentionsCount.set(data.children.length);

//     // create 10 fake mentions
//     for (let i = 0; i < 10; i++) {
//       data.children.push(data.children[0]);
//     }

//     state.mentions = data.children;
//   });

const getWebmentions = async (mentionTarget = target) => {
  if (currentUrl) {
    mentionTarget = window.location.href;
  }

  const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${mentionTarget}`);
  const data = await response.json();
  console.log("Webmentions", data);
  currentWebmentionsCount.set(data.children.length);
  state.mentions = data.children;
};

onMounted(async () => {
  await getWebmentions();
});
</script>

<style lang="scss">
@use "@styles/components/webmentions/webmentions";
</style>
