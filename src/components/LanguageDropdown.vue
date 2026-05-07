<template>
  <VDropdown class="c-button c-button--icon">
    <Languages />
    <template #popper>
      <menu class="c-lang-dropdown u-list-reset">
        <li
          v-for="(path, language) in routes"
          :key="language"
          class="c-lang-dropdown__item"
        >
          <a
            class="c-lang-dropdown__link"
            :class="{ 'is-active': lang === language }"
            :href="path"
          >
            {{ languages[language] }}
          </a>
        </li>
      </menu>
    </template>
  </VDropdown>
</template>

<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { currentLanguage, translationRoutes } from "@stores/store";
import { languages } from "@utils/i18n/ui";
import Languages from "virtual:icons/lucide/languages";

// Reactive store values
const lang = useStore(currentLanguage);
const routes = useStore(translationRoutes);
</script>

<style lang="scss">
@use "@styles/components/lang-dropdown.scss";
</style>
