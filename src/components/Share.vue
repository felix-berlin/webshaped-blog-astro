<template>
  <button
    v-if="isSupported"
    type="button"
    class="c-share"
    @click.prevent="share({ text, title, url: url ?? currentUrl() })"
  >
    <Share2
      v-if="showButton"
      focusable="false"
      :aria-label="t('share.label')"
      class="c-share__icon"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import { useShare } from "@vueuse/core";
import Share2 from "virtual:icons/lucide/share-2";

import { useI18n } from "@/composables/useI18n";

export interface ShareProps {
  lang: Lang;
  showButton?: boolean;
  text?: string;
  title?: string;
  /** Defaults to the current page. */
  url?: string;
}

const { lang, showButton = true, text, title, url } = defineProps<ShareProps>();

const { isSupported, share } = useShare();
const currentUrl = () => window.location.href;
const { t } = useI18n(() => lang);
</script>
