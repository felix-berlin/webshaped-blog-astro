<template>
  <div class="c-date-modified">
    <p class="c-date-modified__headline">
      {{ t("last_updated") }}
    </p>
    <Date :date="toIsoUtc(date)!" :lang="lang" class="c-date-modified__date" />
  </div>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import Date from "@components/post/Date.vue";
import { toIsoUtc } from "@utils/helpers";

import { useI18n } from "@/composables/useI18n";
export interface DateModifiedProps {
  date: string | undefined;
  lang: Lang;
}

const { date, lang } = defineProps<DateModifiedProps>();
const { t } = useI18n(() => lang);
</script>
