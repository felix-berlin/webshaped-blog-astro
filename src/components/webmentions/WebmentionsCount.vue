<template>
  <component :is="elementIs" class="c-webmentions-count">
    <AtSign
      aria-label="Webmentions Anzahl"
      class="c-webmentions-count__icon"
      width="18"
      height="18"
    />
    <span class="c-webmentions-count__count">
      {{ t("webmentions_count.label--plural", { count: count }, count) }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { currentWebmentionsCount, currentLanguage } from "@stores/store";
import AtSign from "virtual:icons/lucide/at-sign";
import { useTranslations } from "@utils/i18n/utils";
import type { Language, Maybe } from "@/gql/graphql.ts";

interface WebmentionsCountProps {
  elementIs?: string;
  lang: Maybe<Language>;
  href?: string;
}

withDefaults(defineProps<WebmentionsCountProps>(), {
  elementIs: "div",
});

const count = useStore(currentWebmentionsCount);
const lang = useStore(currentLanguage);
const t = useTranslations(lang.value);
</script>

<style scoped></style>
