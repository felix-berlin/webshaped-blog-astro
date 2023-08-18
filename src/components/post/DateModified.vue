<template>
  <Date :date="date!" :lang="lang">
    <template #before>
      <Calendar width="18" height="18" />
    </template>
  </Date>
</template>

<script setup lang="ts">
import Date from "@components/post/Date.vue";
import type { Language, Maybe } from "@ts_types/generated/graphql";
import Calendar from "virtual:icons/lucide/calendar";

export interface DateModifiedProps {
  date: string | undefined;
  lang: Maybe<Language>;
}

const props = defineProps<DateModifiedProps>();
</script>
