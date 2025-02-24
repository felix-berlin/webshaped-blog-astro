<template>
  <article :id="'webmention-' + mention['wm-id']" class="c-webmention">
    <header class="c-webmention__header c-comment__header">
      <img
        :src="mention.author.photo"
        :alt="
          __(lang?.locale!, 'comment.author.image.alt', {
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
            {{ __(lang?.locale!, "webmention.posted_on") }}
          </template>
        </Date>

        <a
          :href="mention.url"
          class="c-webmention__source"
          target="_blank"
          :aria-label="
            __(lang?.locale, 'brand_logo.icon_label', {
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
import { __ } from "@utils/i18n/utils";
import { getHostName } from "@utils/helpers";
import ExternalLink from "virtual:icons/lucide/external-link";
import IconBrandReddit from "virtual:icons/tabler/brand-reddit";
import IconBrandMastodon from "virtual:icons/tabler/brand-mastodon";
import IconBrandGithub from "virtual:icons/tabler/brand-github";
import IconBrandTwitter from "virtual:icons/tabler/brand-twitter";
import IconBrandFacebook from "virtual:icons/tabler/brand-facebook";

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

/**
 * Load icons for the different social media platforms
 *
 * @param   {string}  url
 */
const loadIcons = (url: string) => {
  if (getHostName(url, true) === "twitter") {
    return IconBrandTwitter;
  }
  if (getHostName(url, true) === "github") {
    return IconBrandGithub;
  }
  if (getHostName(url, true) === "reddit") {
    return IconBrandReddit;
  }
  if (getHostName(url, true) === "facebook") {
    return IconBrandFacebook;
  }
  if (getHostName(url, true) === "mastodon") {
    return IconBrandMastodon;
  }
  return ExternalLink;
};
</script>

<style scoped></style>
