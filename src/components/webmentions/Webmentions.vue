<template>
  <div
    v-for="(mention, index) in state.mentions"
    id="webmentions"
    :key="index"
    class="c-webmentions"
  >
    <div class="c-webmentions__item">
      <a
        :href="mention.author.url"
        target="_blank"
        class="c-webmentions__author-image-link"
      >
        <img
          :src="mention.author.photo"
          :alt="mention.author.name"
          width="75"
          height="75"
          loading="lazy"
          decoding="async"
          class="c-webmentions__author-image"
        />
      </a>
      <a
        :href="mention.url"
        target="_blank"
        :aria-label="
          __(currentLang?.locale, 'brand_logo.icon_label', {
            plattform: getDomainName(mention.url),
          })
        "
      >
        <KeepAlive>
          <Component :is="loadIcons(mention.url)" />
        </KeepAlive>
      </a>
      <h2 class="c-webmentions__author-name">
        {{ mention.author.name }}
      </h2>
      <Date
        class="c-webmentions__date"
        :date="mention.published"
        :lang="currentLang?.locale"
      />
      <div class="c-webmentions__text" v-text="mention.content.text" />
    </div>
  </div>
  <NoMentions v-if="webmentionsCount === 0" />
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useStore } from "@nanostores/vue";
import { currentWebmentionsCount, currentLanguage } from "@stores/store";
import Date from "@components/post/Date.vue";
import ExternalLink from "virtual:icons/lucide/external-link";
import { __ } from "@i18n/i18n";
import NoMentions from "@components/webmentions/NoMentions.vue";
import { getDomainName } from "@utils/helpers";
import IconBrandReddit from "virtual:icons/tabler/brand-reddit";
import IconBrandMastodon from "virtual:icons/tabler/brand-mastodon";
import IconBrandGithub from "virtual:icons/tabler/brand-github";
import IconBrandTwitter from "virtual:icons/tabler/brand-twitter";
import IconBrandFacebook from "virtual:icons/tabler/brand-facebook";

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

interface State {
  mentions: {
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
  }[];
}

const props = withDefaults(defineProps<WebmentionsProps>(), {
  target: "",
  currentUrl: false,
});

const state: State = reactive({
  mentions: [],
});

const webmentionsCount = useStore(currentWebmentionsCount);

const currentLang = useStore(currentLanguage);

onMounted(async () => {
  /**
   * Fetch all webmentions for the current page
   *
   * @var {[type]}
   */
  await fetch(`https://webmention.io/api/mentions.jf2?target=${props.target}`)
    .then((res) => res.json())
    .then(async (data) => {
      // TODO: Remove or comment out. This is just for testing.
      await new Promise((resolve) => setTimeout(resolve, 5000));
      currentWebmentionsCount.set(data.children.length);
      state.mentions = data.children;
    });
});

// const getWebmentions = async (target = props.target) => {
//   if (props.currentUrl) {
//     target = window.location.href;
//   }

//   const response = await fetch(
//     `https://webmention.io/api/mentions.jf2?target=${target}`,
//   );
//   const data = await response.json();
//   console.log("Webmentions", data);
//   currentWebmentionsCount.set(data.children.length);
//   state.mentions = data.children;
// };

// onMounted(async () => {
//   await getWebmentions();
// });

const loadIcons = (url: string) => {
  if (getDomainName(url) === "twitter") {
    return IconBrandTwitter;
  }
  if (getDomainName(url) === "github") {
    return IconBrandGithub;
  }
  if (getDomainName(url) === "reddit") {
    return IconBrandReddit;
  }
  if (getDomainName(url) === "facebook") {
    return IconBrandFacebook;
  }
  if (getDomainName(url) === "mastodon") {
    return IconBrandMastodon;
  }
  return ExternalLink;
};
</script>
