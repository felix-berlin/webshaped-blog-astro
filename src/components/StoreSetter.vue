<template>
  <slot />
</template>

<script setup lang="ts">
import { currentLanguage, translationRoutes } from "@stores/store";

const { lang, localeRoutes } = defineProps({
  lang: {
    required: true,
    type: String,
  },
  localeRoutes: {
    default: () => ({}),
    type: Object,
  },
});

translationRoutes.set(localeRoutes);
currentLanguage.set(lang);
</script>
