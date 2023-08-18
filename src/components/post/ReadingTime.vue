<template>
  <div class="c-reading-time" :title="__(lang?.locale!, 'reading_time.title')">
    <BookOpen
      aria-hidden="true"
      focusable="false"
      class="c-reading-time__icon"
      width="18"
      height="18"
    />
    <span class="c-reading-time__time">{{
      __(lang?.locale!, "reading_time.text--plural", { minutes: time }, time)
    }}</span>
  </div>
</template>

<script setup lang="ts">
import BookOpen from "virtual:icons/lucide/book-open";
import { __ } from "@i18n/i18n";
import type { Language, Maybe } from "@ts_types/generated/graphql";

export interface ReadingTimeProps {
  time: number | undefined;
  lang: Maybe<Language>;
}

defineProps<ReadingTimeProps>();
</script>
