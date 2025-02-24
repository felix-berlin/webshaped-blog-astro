<template>
  <div class="c-social-list">
    <template v-for="(social, index) in socialItems" :key="social">
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
import IconBrandReddit from "virtual:icons/tabler/brand-reddit";
import IconBrandMastodon from "virtual:icons/tabler/brand-mastodon";
import IconBrandGithub from "virtual:icons/tabler/brand-github";
import IconBrandTwitter from "virtual:icons/tabler/brand-twitter";
import IconBrandFacebook from "virtual:icons/tabler/brand-facebook";
import IconBrandInstagram from "virtual:icons/tabler/brand-instagram";
import IconBrandYoutube from "virtual:icons/tabler/brand-youtube";
import IconBrandLinkedin from "virtual:icons/tabler/brand-linkedin";
import { useTranslations } from "@utils/i18n/utils";
import type { Maybe } from "@ts_types/generated/graphql";

export interface SocialItems {
  url?: Maybe<string>;
  target?: string;
  label?: string;
  class?: string;
  rel?: string;
  size?: number;
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
  lang: string;
}

const { socialItems, lang } = defineProps<SocialListProps>();

const t = useTranslations(lang);

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
  if (component === "reddit") {
    return IconBrandReddit;
  }

  return;
};
</script>

<style lang="scss">
@use "@styles/components/social-list";
</style>
