<template>
  <div v-if="years >= showAfterYears" class="c-post-older-than">
    <p class="c-post-older-than__text">
      {{ t("post_older_than.text", { years }) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import { computed } from "vue";

import { useI18n } from "@/composables/useI18n";

export interface PostOlderThanProps {
  date: null | string | undefined;
  lang: Lang;
  showAfterYears: number;
}

const { date, lang, showAfterYears } = defineProps<PostOlderThanProps>();
const { t } = useI18n(() => lang);

const years = computed(() =>
  Math.abs(new Date().getFullYear() - new Date(date ?? "").getFullYear()),
);
</script>

<style lang="scss">
@use "@styles/components/post-older-than";
</style>
