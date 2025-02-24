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
      :aria-label="__(lang?.locale, 'share.label')"
      class="c-share__icon"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import Share2 from "virtual:icons/lucide/share-2";
import { onMounted, ref } from "vue";
import { useShare } from "@vueuse/core";
import { __ } from "@utils/i18n/utils";
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

const lang = useStore(currentLanguage);
const currentUrl = ref(props.url);

const startShare = (
  title: string | undefined,
  text: string | undefined,
  url: string | undefined,
) => {
  share({ title, text, url });
};

onMounted(() => {
  if (!props.url) {
    currentUrl.value = window.location.href;
  }
});
</script>
