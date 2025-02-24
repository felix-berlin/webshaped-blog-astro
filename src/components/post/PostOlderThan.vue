<template>
  <div v-if="getYearDiff(date!, Date.now()) >= showAfterYears" class="c-post-older-than">
    <p class="c-post-older-than__text">
      {{
        t("post_older_than.text", {
          years: getYearDiff(date!, Date.now()),
        })
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useTranslations } from "@utils/i18n/utils";
import type { Maybe } from "@ts_types/generated/graphql";

export interface PostOlderThanProps {
  date: Maybe<string>;
  showAfterYears: number;
  lang: string;
}

const { date, showAfterYears, lang } = defineProps<PostOlderThanProps>();
const t = useTranslations(lang);

const getYearDiff = (date1: string | number, date2: string | number) => {
  return Math.abs(new Date(date2).getFullYear() - new Date(date1).getFullYear());
};
</script>

<style lang="scss">
@use "@styles/components/post-older-than";
</style>
