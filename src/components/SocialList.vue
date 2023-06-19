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
            : __(lang.locale!, 'social_list.link.label', { platform: index })
        "
        :class="`c-social-list__link ${social.class ? social.class : ''}`"
        :rel="social.rel ? social.rel : 'noopener noreferrer'"
      >
        <Github
          v-if="index === 'github'"
          :class="`c-social-list__icon is-${index}`"
          :size="social.size ? social.size : 24"
          :stroke-width="social.strokeWidth ? social.strokeWidth : 2"
          :color="social.color ? social.color : 'currentColor'"
        />
        <Facebook
          v-if="index === 'facebook'"
          :class="`c-social-list__icon is-${index}`"
          :size="social.size ? social.size : 24"
          :stroke-width="social.strokeWidth ? social.strokeWidth : 2"
        />
        <Twitter
          v-if="index === 'twitter'"
          :class="`c-social-list__icon is-${index}`"
          :size="social.size ? social.size : 24"
          :stroke-width="social.strokeWidth ? social.strokeWidth : 2"
        />
        <Instagram
          v-if="index === 'instagram'"
          :class="`c-social-list__icon is-${index}`"
          :size="social.size ? social.size : 24"
          :stroke-width="social.strokeWidth ? social.strokeWidth : 2"
        />
        <Youtube
          v-if="index === 'youTube'"
          :class="`c-social-list__icon is-${index}`"
          :size="social.size ? social.size : 24"
          :stroke-width="social.strokeWidth ? social.strokeWidth : 2"
        />
        <Linkedin
          v-if="index === 'linkedIn'"
          :class="`c-social-list__icon is-${index}`"
          :size="social.size ? social.size : 24"
          :stroke-width="social.strokeWidth ? social.strokeWidth : 2"
        />
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  Github,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-vue-next";
import { __ } from "@i18n/i18n";
import type { Language, Maybe } from "../types/generated/graphql";

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
  };
  lang: Language;
}

const props = defineProps<SocialListProps>();
</script>

<style lang="scss">
@use "../styles/components/social-list";
</style>
