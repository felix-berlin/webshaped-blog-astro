<template>
  <div class="c-social-list">
    <template
      v-for="(social, index) in socialItems"
      :key="index"
    >
      <a
        v-if="social?.url && social !== null"
        :href="social.url"
        :target="social.target ? social.target : '_blank'"
        :aria-label="social.label ? social.label : `Besuche mich auf ${index}`"
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
import { Github, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-vue-next'

export interface SocialListItem {
  url: string;
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
    facebook?: SocialListItem;
    instagram?: SocialListItem;
    linkedIn?: SocialListItem;
    mySpace?: SocialListItem;
    pinterest?: SocialListItem;
    soundCloud?: SocialListItem;
    twitter?: SocialListItem;
    wikipedia?: SocialListItem;
    youTube?: SocialListItem;
    github?: SocialListItem;
  }
}

const props = defineProps<SocialListProps>()
</script>

<style lang="scss">
  @use '../styles/components/social-list';
</style>
