<template>
  <div>
    <div v-if="webmentionsCount > 0" class="c-webmentions">
      <WebmentionsItem
        v-for="(mention, index) in mentions"
        :key="mention['wm-id']"
        :mention="mention"
        :index="index"
        :lang="lang"
      />
    </div>
    <NoMentions v-if="webmentionsCount === 0" :lang="lang" />
  </div>
</template>

<script setup lang="ts">
import type { Webmention } from "@components/webmentions/WebmentionsItem.vue";

import { useStore } from "@nanostores/vue";
import { currentWebmentionsCount } from "@stores/store";
import { defineAsyncComponent, onMounted, ref } from "vue";

const WebmentionsItem = defineAsyncComponent(
  () => import("@components/webmentions/WebmentionsItem.vue"),
);

const NoMentions = defineAsyncComponent(() => import("@components/webmentions/NoMentions.vue"));

/**
 * Everything about Webmentions
 *
 * @see https://webmention.io/
 * Good read: @see https://daily-dev-tips.com/posts/goodbye-comments-welcome-webmentions/
 * Social mentions provider: @see https://brid.gy/
 */

export interface WebmentionsProps {
  currentUrl?: boolean;
  lang: "de" | "en";
  target?: string;
}

const { currentUrl = false, lang, target = "" } = defineProps<WebmentionsProps>();

const mentions = ref<Webmention[]>([]);

const webmentionsCount = useStore(currentWebmentionsCount);

const getWebmentions = async () => {
  const mentionTarget = currentUrl ? window.location.href : target;

  const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${mentionTarget}`);
  const data = await response.json();
  currentWebmentionsCount.set(data.children.length);
  mentions.value = data.children;
};

onMounted(getWebmentions);
</script>

<style lang="scss">
@use "@styles/components/webmentions/webmentions";
</style>
