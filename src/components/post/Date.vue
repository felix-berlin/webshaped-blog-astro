<template>
  <div class="c-date">
    <slot name="before" />

    <time :datetime="date" v-text="formattedDate" />

    <slot name="after" />
  </div>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import { localeTags } from "@i18n/ui";
import { computed } from "vue";

export interface DateProps {
  /** ISO 8601 date; WPGraphQL `*Gmt` values must go through `toIsoUtc` first. */
  date: string;
  lang: Lang;
}

const { date, lang } = defineProps<DateProps>();

const formattedDate = computed(() =>
  new Date(date).toLocaleDateString(localeTags[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
);
</script>
