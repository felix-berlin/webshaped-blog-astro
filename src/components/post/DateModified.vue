<template>
  <div class="c-date-modified">
    <p class="c-date-modified__headline">
      {{ t("last_updated") }}
    </p>
    <Date :date="date!" :lang="{ locale: lang }" class="c-date-modified__date" />
  </div>
</template>

<script setup lang="ts">
import Date from "@components/post/Date.vue";
import type { localeStrings } from "@i18n/ui";
import { useTranslations } from "@utils/i18n/utils";
export interface DateModifiedProps {
  date: string | undefined;
  lang: keyof typeof localeStrings;
}

const { date, lang } = defineProps<DateModifiedProps>();
const t = useTranslations(lang);
</script>
