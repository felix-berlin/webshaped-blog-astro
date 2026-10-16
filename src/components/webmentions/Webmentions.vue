<template>
  <div v-if="mentions.length" class="c-webmentions">
    <WebmentionsItem
      v-for="(mention, index) in mentions"
      :key="mention['wm-id']"
      :mention="mention"
      :index="index"
      :lang="lang"
    />
  </div>
  <NoMentions v-else :lang="lang" />
</template>

<script setup lang="ts">
import type { Webmention } from "@components/webmentions/WebmentionsItem.vue";
import type { Lang } from "@i18n/ui";

import { WEBMENTION_IO } from "@utils/helpers";
import { defineAsyncComponent } from "vue";

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
 *
 * Async setup: the parent <Suspense> (LoadWebmentions) shows the skeleton until the fetch resolves.
 */

export interface WebmentionsProps {
  lang: Lang;
  /** Defaults to the current page URL. */
  target?: string;
}

const { lang, target } = defineProps<WebmentionsProps>();

const response = await fetch(
  `${WEBMENTION_IO}api/mentions.jf2?target=${target ?? window.location.href}`,
);
const mentions: Webmention[] = (await response.json()).children;
</script>

<style lang="scss">
@use "@styles/components/webmentions/webmentions";
</style>
