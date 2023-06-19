<template>
  <Date :date="date" :lang="lang">
    <template #before>
      <Calendar :size="18" />
    </template>
  </Date>
</template>

<script setup lang="ts">
import Date from "@components/post/Date.vue";
import { Calendar } from "lucide-vue-next";
import type { Language, Maybe } from "../../types/generated/graphql";

export interface DateModifiedProps {
  date: string | undefined;
  lang?: Maybe<Language> | undefined;
}

const props = defineProps<DateModifiedProps>();
</script>

<style scoped></style>
