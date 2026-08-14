<template>
  <VDropdown class="c-button c-button--icon">
    <Languages />
    <template #popper>
      <menu class="c-lang-dropdown u-list-reset">
        <li v-for="(path, language) in routes" :key="language" class="c-lang-dropdown__item">
          <a class="c-lang-dropdown__link" :class="{ 'is-active': lang === language }" :href="path">
            {{ languages[language as keyof typeof languages] }}
          </a>
        </li>
      </menu>
    </template>
  </VDropdown>
</template>

<script setup lang="ts">
import { languages } from "@utils/i18n/ui";
import Languages from "virtual:icons/lucide/languages";

import type { TranslationRoutes } from "@/types/i18n";

defineProps<{
  lang: "de" | "en";
  routes: TranslationRoutes;
}>();
</script>

<style lang="scss">
@use "@styles/components/lang-dropdown.scss";
</style>
