<template>
  <div class="c-reading-time">
    <p class="c-reading-time__headline">
      {{ t("reading_time") }}
    </p>
    <p class="c-reading-time__time">
      {{ t("reading_time.text--plural", { minutes: time ?? 0 }, time) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { localeStrings } from "@i18n/ui";
import { useTranslations } from "@utils/i18n/utils";

export interface ReadingTimeProps {
  lang: keyof typeof localeStrings;
  time: number | undefined;
}

const { lang, time } = defineProps<ReadingTimeProps>();
const t = useTranslations(lang);
</script>
