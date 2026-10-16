<template>
  <div class="c-social-list">
    <template v-for="(social, index) in socialItems" :key="index">
      <a
        v-if="social?.url"
        v-tooltip="{ content: index, placement: 'top' }"
        :href="social.url"
        :target="social.target || '_blank'"
        :aria-label="social.label || t('social_list.link.label', { platform: index })"
        :class="`c-social-list__link c-button c-button--outline ${social.class || ''}`"
        :rel="social.rel || 'noopener noreferrer'"
        itemprop="sameAs"
      >
        <component
          :is="socialIcons[index]"
          :class="`c-social-list__icon is-${index}`"
          :color="social.color || 'currentColor'"
          :width="social.size || 24"
          :height="social.size || 24"
        />
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Lang } from "@utils/i18n/ui";

import { socialIcons } from "@utils/socialIcons";

import { useI18n } from "@/composables/useI18n";

export interface SocialItems {
  class?: string;
  color?: string;
  label?: string;
  rel?: string;
  size?: number;
  target?: string;
  url?: null | string;
}

export interface SocialListProps {
  lang: Lang;
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

const { t } = useI18n(() => lang);
</script>

<style lang="scss">
@use "@styles/components/social-list";
</style>
