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
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";
import { useTranslations } from "@utils/i18n/utils";
import { useShare } from "@vueuse/core";
import Share2 from "virtual:icons/lucide/share-2";
import { onMounted, ref } from "vue";

export interface ShareProps {
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

const lang = useStore(currentLanguage);
const currentUrl = ref(props.url);
const t = useTranslations(lang.value);

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
