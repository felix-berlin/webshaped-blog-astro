<template>
  <component :is="elementIs" class="c-webmentions-count">
    <AtSign
      aria-label="Webmentions Anzahl"
      class="c-webmentions-count__icon"
      width="18"
      height="18"
    />
    <span class="c-webmentions-count__count">
      {{ t("webmentions_count.label--plural", { count: count }, count) }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { currentWebmentionsCount } from "@stores/store";
import AtSign from "virtual:icons/lucide/at-sign";

import { useI18n } from "@/composables/useI18n";

interface WebmentionsCountProps {
  elementIs?: string;
  href?: string;
  lang: string;
}

withDefaults(defineProps<WebmentionsCountProps>(), {
  elementIs: "div",
});

const count = useStore(currentWebmentionsCount);
const { t } = useI18n();
</script>

<style scoped></style>
