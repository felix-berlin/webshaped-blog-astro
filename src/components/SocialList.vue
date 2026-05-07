<template>
  <div class="c-social-list">
    <template
      v-for="(social, index) in socialItems"
      :key="social"
    >
      <a
        v-if="social?.url && social !== null"
        v-tooltip="{ content: index, placement: 'top' }"
        :href="social.url"
        :target="social.target ? social.target : '_blank'"
        :aria-label="social.label ? social.label : t('social_list.link.label', { platform: index })"
        :class="`c-social-list__link c-button c-button--outline ${
          social.class ? social.class : ''
        }`"
        :rel="social.rel ? social.rel : 'noopener noreferrer'"
        itemprop="sameAs"
      >
        <KeepAlive>
          <component
            :is="returnComponent(index)"
            :class="`c-social-list__icon is-${index}`"
            :color="social.color ? social.color : 'currentColor'"
            :width="social.size ? social.size : 24"
            :height="social.size ? social.size : 24"
          />
        </KeepAlive>
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useTranslations } from "@utils/i18n/utils";
import { defineAsyncComponent } from "vue";

import type { Maybe } from "@/gql/graphql.ts";

export interface SocialItems {
  class?: string;
  color?: string;
  label?: string;
  rel?: string;
  size?: number;
  target?: string;
  url?: Maybe<string>;
}

export interface SocialListProps {
  lang: string;
  socialItems: {
    facebook?: SocialItems;
    github?: SocialItems;
    instagram?: SocialItems;
    linkedIn?: SocialItems;
    mastodon?: SocialItems;
    mySpace?: SocialItems;
    pinterest?: SocialItems;
    soundCloud?: SocialItems;
    twitter?: SocialItems;
    wikipedia?: SocialItems;
    youTube?: SocialItems;
  };
}

const { lang, socialItems } = defineProps<SocialListProps>();

const t = useTranslations(lang);

/**
 * Dynamically load the icon component for the given platform
 *
 * @param {string} component - The platform name
 * @returns {object} - The async component
 */
const returnComponent = (component: string) => {
  switch (component) {
    case "facebook":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-facebook"));
    case "github":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-github"));
    case "instagram":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-instagram"));
    case "linkedIn":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-linkedin"));
    case "mastodon":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-mastodon"));
    case "reddit":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-reddit"));
    case "twitter":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-twitter"));
    case "youtube":
      return defineAsyncComponent(() => import("virtual:icons/tabler/brand-youtube"));
    default:
      return null;
  }
};
</script>

<style lang="scss">
@use "@styles/components/social-list";
</style>
