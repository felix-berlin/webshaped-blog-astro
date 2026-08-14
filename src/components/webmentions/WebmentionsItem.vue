<template>
  <article :id="'webmention-' + mention['wm-id']" class="c-webmention">
    <header class="c-webmention__header c-comment__header">
      <img
        :src="mention.author.photo"
        :alt="
          t('comment.author.image.alt', {
            author: mention.author.name,
          })
        "
        width="100"
        height="100"
        :loading="index < 3 ? 'eager' : 'lazy'"
        decoding="async"
        class="c-webmentions__author-image c-comment__author-image"
      />

      <div class="c-comment__author-name-wrap">
        <h2 class="c-webmentions__author-name c-comment__author-name">
          <a :href="mention.author.url" target="_blank" class="c-webmentions__author-image-link">
            {{ mention.author.name }}
          </a>
        </h2>
      </div>
    </header>

    <main class="c-webmention__content">
      <div class="c-webmentions__text c-comment__text" v-text="mention.content.text" />

      <footer class="c-webmention__footer c-comment__footer">
        <Date
          class="c-webmentions__date c-comment__date"
          :date="mention.published"
          :lang="{ locale: lang }"
        >
          <template #before>
            {{ t("webmention.posted_on") }}
          </template>
        </Date>

        <a
          :href="mention.url"
          class="c-webmention__source"
          target="_blank"
          :aria-label="
            t('brand_logo.icon_label', {
              platform: getHostName(mention.url, true),
            })
          "
        >
          <KeepAlive>
            <Component :is="loadIcons(mention.url)" class="c-webmention__source-icon" />
          </KeepAlive>
        </a>
      </footer>
    </main>
  </article>
</template>

<script setup lang="ts">
import Date from "@components/post/Date.vue";
import { getHostName } from "@utils/helpers";
import { defineAsyncComponent } from "vue";

import { useI18n } from "@/composables/useI18n";

export interface Webmention {
  author: {
    name: string;
    photo: string;
    type: string;
    url: string;
  };
  content: {
    html: string;
    text: string;
  };
  "mention-of": string;
  published: string;
  type: string;
  url: string;
  "wm-id": number;
  "wm-private": boolean;
  "wm-property": string;
  "wm-received": string;
  "wm-source": string;
  "wm-target": string;
}

interface WebmentionsProps {
  index: number;
  lang: "de" | "en";
  mention: Webmention;
}

const { index, lang, mention } = defineProps<WebmentionsProps>();
const { t } = useI18n(() => lang);

/**
 * Load icons for the different social media platforms
 *
 * @param   {string}  url
 */
const loadIcons = (url: string) => {
  const platform = getHostName(url, true);

  switch (platform) {
    case "facebook":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-facebook"));
    case "github":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-github"));
    case "mastodon":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-mastodon"));
    case "reddit":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-reddit"));
    case "twitter":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-twitter"));
    default:
      return defineAsyncComponent(() => import("virtual:icons/lucide/external-link"));
  }
};
</script>

<style scoped></style>
