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
        :loading="index < 3 ? 'edge' : 'lazy'"
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
          :lang="lang?.locale"
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
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";
import Date from "@components/post/Date.vue";
import { useTranslations } from "@utils/i18n/utils";
import { getHostName } from "@utils/helpers";
import { ref, onMounted, defineAsyncComponent } from "vue";

export interface Webmention {
  author: {
    name: string;
    photo: string;
    url: string;
    type: string;
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
  mention: Webmention;
  index: number;
}

const { mention, index } = defineProps<WebmentionsProps>();

const lang = useStore(currentLanguage);
const t = useTranslations(lang.value);
const icon = ref(null);

/**
 * Load icons for the different social media platforms
 *
 * @param   {string}  url
 */
const loadIcons = (url: string) => {
  const platform = getHostName(url, true);

  switch (platform) {
    case "twitter":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-twitter"));
    case "github":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-github"));
    case "reddit":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-reddit"));
    case "facebook":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-facebook"));
    case "mastodon":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-mastodon"));
    default:
      return defineAsyncComponent(() => import("virtual:icons/lucide/external-link"));
  }
};

// Load the icon when the component is mounted
onMounted(() => {
  icon.value = loadIcons(mention.url);
});
</script>

<style scoped></style>
