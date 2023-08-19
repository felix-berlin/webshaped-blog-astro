<template>
  <div class="c-date-modified">
    <p class="c-date-modified__headline">
      {{ __(lang?.locale!, "last_updated") }}
    </p>
    <Date :date="date!" :lang="lang" class="c-date-modified__date" />
  </div>
</template>

<script setup lang="ts">
import Date from "@components/post/Date.vue";
import type { Language, Maybe } from "@ts_types/generated/graphql";
import { __ } from "@i18n/i18n";
export interface DateModifiedProps {
  date: string | undefined;
  lang: Maybe<Language>;
}

defineProps<DateModifiedProps>();
</script>
