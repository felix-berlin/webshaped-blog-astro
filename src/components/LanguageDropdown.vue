<template>
  <VDropdown class="c-button c-button--icon">
    <Languages />
    <template #popper>
      <menu class="c-lang-dropdown u-list-reset">
        <li
          v-for="{ language, path } in availableRoutes"
          :key="language"
          class="c-lang-dropdown__item"
        >
          <a class="c-lang-dropdown__link" :class="{ 'is-active': lang === language }" :href="path">
            {{ languages[language] }}
          </a>
        </li>
      </menu>
    </template>
  </VDropdown>
</template>

<script setup lang="ts">
import { languages } from "@utils/i18n/ui";
import Languages from "virtual:icons/lucide/languages";
import { computed } from "vue";

import type { TranslationRoutes } from "@/types/i18n";

const LOCALES = ["de", "en"] as const;

const props = defineProps<{
  lang: "de" | "en";
  routes: TranslationRoutes;
}>();

// Only render entries for actual locales — defensive against any non-locale
// key that might land in `routes`.
const availableRoutes = computed(() =>
  LOCALES.filter((language) => props.routes[language]).map((language) => ({
    language,
    path: props.routes[language] as string,
  })),
);
</script>

<style lang="scss">
@use "@styles/components/lang-dropdown.scss";
</style>
