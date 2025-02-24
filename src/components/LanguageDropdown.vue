<template>
  <VDropdown class="c-button c-button--icon">
    <Languages />
    <template #popper>
      <menu class="c-lang-dropdown u-list-reset">
        <li class="c-lang-dropdown__item" v-for="(label, language) in languages" :key="language">
          <a
            class="c-lang-dropdown__link"
            :href="translatePath(`/${route ? route : ''}`, language)"
            >{{ label }}</a
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
import { currentLanguage } from "@stores/store";
import { useStore } from "@nanostores/vue";
import Languages from "virtual:icons/lucide/languages";

const lang = useStore(currentLanguage);
const currentUrl = ref();
const translatePath = ref();
const route = ref();

onMounted(() => {
  currentUrl.value = new URL(window.location.href);
  route.value = getRouteFromUrl(currentUrl.value);
  translatePath.value = useTranslatedPath(lang.value);
});
</script>

<style scoped></style>
