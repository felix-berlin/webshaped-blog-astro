<template>
  <button
    v-if="isSupported"
    type="button"
    class="c-share"
    @click.prevent="startShare(title, text, currentUrl)"
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
import { useShare } from "@vueuse/core";
import Share2 from "virtual:icons/lucide/share-2";
import { onMounted, ref } from "vue";

import { useI18n } from "@/composables/useI18n";

export interface ShareProps {
  lang: "de" | "en";
  showButton?: boolean;
  text?: string;
  title?: string;
  url?: string | undefined;
}

const { isSupported, share } = useShare();

const props = withDefaults(defineProps<ShareProps>(), {
  showButton: true,
  text: undefined,
  title: undefined,
  url: undefined,
});

const currentUrl = ref(props.url);
const { t } = useI18n(() => props.lang);

const startShare = (
  title: string | undefined,
  text: string | undefined,
  url: string | undefined,
) => {
  share({ text, title, url });
};

onMounted(() => {
  if (!props.url) {
    currentUrl.value = window.location.href;
  }
});
</script>
