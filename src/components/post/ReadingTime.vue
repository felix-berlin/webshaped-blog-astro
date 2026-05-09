<template>
  <div class="c-reading-time">
    <p class="c-reading-time__headline">
      {{ t("reading_time") }}
    </p>
    <p class="c-reading-time__time">
      {{ t("reading_time.text--plural", { minutes: time }, time) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useTranslations } from "@utils/i18n/utils";

export interface ReadingTimeProps {
  lang: string;
  time: number | undefined;
}

const { lang, time } = defineProps<ReadingTimeProps>();
const t = useTranslations(lang);
</script>
