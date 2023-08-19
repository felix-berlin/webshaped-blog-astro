<template>
  <div class="c-reading-time">
    <p class="c-reading-time__headline">
      {{ __(lang?.locale, "reading_time") }}
    </p>
    <p class="c-reading-time__time">
      {{
        __(lang?.locale!, "reading_time.text--plural", { minutes: time }, time)
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { __ } from "@i18n/i18n";
import type { Language, Maybe } from "@ts_types/generated/graphql";

export interface ReadingTimeProps {
  time: number | undefined;
  lang: Maybe<Language>;
}

defineProps<ReadingTimeProps>();
</script>
