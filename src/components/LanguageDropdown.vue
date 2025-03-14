<template>
  <VDropdown class="c-button c-button--icon">
    <Languages />
    <template #popper>
      <menu class="c-lang-dropdown u-list-reset">
        <li class="c-lang-dropdown__item" v-for="(path, language) in paths" :key="language">
          <Component
            :is="path ? 'a' : 'p'"
            class="c-lang-dropdown__link"
            :class="{ 'is-not-translated': !path, 'is-active': lang === language }"
            :href="path"
            >{{ languages[language] }}</Component
          >
        </li>
      </menu>
    </template>
  </VDropdown>
</template>

<script setup lang="ts">
import { languages } from "@utils/i18n/ui";
import { useTranslatedPath, getRouteFromUrl } from "@utils/i18n/utils";
import { onMounted, ref } from "vue";
import { currentLanguage, translationRoutes } from "@stores/store";
import { useStore } from "@nanostores/vue";
import Languages from "virtual:icons/lucide/languages";

const lang = useStore(currentLanguage);
const routes = useStore(translationRoutes);
const currentUrl = ref();
const translatePath = ref();
const route = ref();
const paths = ref();

const createPaths = (route: string) => {
  const result = {};
  for (const language in languages) {
    result[language] = translatePath.value(`/${route ? route : ""}`, language);
  }
  paths.value = result;
};
onMounted(() => {
  currentUrl.value = new URL(window.location.href);
  route.value = getRouteFromUrl(currentUrl.value);
  translatePath.value = useTranslatedPath(lang.value, routes.value);
  createPaths(route.value);
});
</script>

<style scoped></style>
