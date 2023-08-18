<template>
  <button
    v-if="isSupported"
    type="button"
    class="c-share"
    @click.prevent="startShare(title, text, data.currentUrl)"
  >
    <Share2
      v-if="showButton"
      focusable="false"
      :aria-label="__(lang?.locale, 'share.label')"
      class="c-share__icon"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import Share2 from "virtual:icons/lucide/share-2";
import { onMounted, reactive } from "vue";
import { useShare } from "@vueuse/core";
import { __ } from "@i18n/i18n";
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";

export interface ShareProps {
  title?: string;
  text?: string;
  url?: string | undefined;
  showButton?: boolean;
}

const { share, isSupported } = useShare();

const props = withDefaults(defineProps<ShareProps>(), {
  title: undefined,
  text: undefined,
  url: undefined,
  showButton: true,
});

interface Data {
  currentUrl: string | undefined;
}

const lang = useStore(currentLanguage);
const data: Data = reactive({
  currentUrl: props.url,
});

const startShare = (
  title: string | undefined,
  text: string | undefined,
  url: string | undefined,
) => {
  share({ title, text, url });
};

onMounted(() => {
  if (!props.url) {
    data.currentUrl = window.location.href;
  }
});
</script>
