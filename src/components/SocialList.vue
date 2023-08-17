<template>
  <div class="c-social-list">
    <template v-for="(social, index) in socialItems" :key="social">
      <a
        v-if="social?.url && social !== null"
        v-tooltip="{ content: index, placement: 'top' }"
        :href="social.url"
        :target="social.target ? social.target : '_blank'"
        :aria-label="
          social.label
            ? social.label
            : __(lang?.locale!, 'social_list.link.label', { platform: index })
        "
        :class="`c-social-list__link ${social.class ? social.class : ''}`"
        :rel="social.rel ? social.rel : 'noopener noreferrer'"
      >
        <KeepAlive>
          <component
            :is="returnComponent(index)"
            :class="`c-social-list__icon is-${index}`"
            :size="social.size ? social.size : 24"
            :stroke-width="social.strokeWidth ? social.strokeWidth : 2"
            :color="social.color ? social.color : 'currentColor'"
          />
        </KeepAlive>
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  IconBrandGithub,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandLinkedin,
  IconBrandMastodon,
} from "@tabler/icons-vue";
import { __ } from "@i18n/i18n";
import type { Language, Maybe } from "@ts_types/generated/graphql";

export interface SocialItems {
  url?: Maybe<string>;
  target?: string;
  label?: string;
  class?: string;
  rel?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export interface SocialListProps {
  socialItems: {
    facebook?: SocialItems;
    instagram?: SocialItems;
    linkedIn?: SocialItems;
    mySpace?: SocialItems;
    pinterest?: SocialItems;
    soundCloud?: SocialItems;
    twitter?: SocialItems;
    wikipedia?: SocialItems;
    youTube?: SocialItems;
    github?: SocialItems;
    mastodon?: SocialItems;
  };
  lang: Maybe<Language>;
}

defineProps<SocialListProps>();

const returnComponent = (component: string) => {
  if (component === "github") {
    return IconBrandGithub;
  }
  if (component === "facebook") {
    return IconBrandFacebook;
  }
  if (component === "twitter") {
    return IconBrandTwitter;
  }
  if (component === "instagram") {
    return IconBrandInstagram;
  }
  if (component === "youtube") {
    return IconBrandYoutube;
  }
  if (component === "linkedIn") {
    return IconBrandLinkedin;
  }
  if (component === "mastodon") {
    return IconBrandMastodon;
  }

  return;
};
</script>

<style lang="scss">
@use "@styles/components/social-list";
</style>
