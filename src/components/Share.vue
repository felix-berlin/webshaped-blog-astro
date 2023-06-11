<template>
  <button
    v-if="isSupported"
    type="button"
    class="c-share"
    @click.prevent="startShare(title, text, data.currentUrl)"
  >
    <Share2
      focusable="false"
      :aria-label="__(lang.locale, 'share.label')"
      class="c-share__icon"
    />
  </button>
</template>

<script setup lang="ts">
import { Share2 } from "lucide-vue-next";
import { ref, onMounted, reactive } from "vue";
import { useShare } from "@vueuse/core";
import { __ } from "@i18n/i18n";

export interface ShareProps {
  title?: string;
  text?: string;
  url?: string | undefined;
  lang: {
    locale: string;
  };
}

const { share, isSupported } = useShare();

const props = defineProps<ShareProps>();

interface Data {
  currentUrl: string | undefined;
}

const data: Data = reactive({
  currentUrl: props.url,
});

const startShare = (
  title: string | undefined,
  text: string | undefined,
  url: string | undefined
) => {
  share({ title, text, url });
};

onMounted(() => {
  if (!props.url) {
    data.currentUrl = window.location.href;
  }
});
</script>
