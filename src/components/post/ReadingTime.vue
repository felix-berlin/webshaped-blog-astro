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
import type { Lang } from "@i18n/ui";

import { useI18n } from "@/composables/useI18n";

export interface ReadingTimeProps {
  lang: Lang;
  time: number | undefined;
}

const { lang, time } = defineProps<ReadingTimeProps>();
const { t } = useI18n(() => lang);
</script>
