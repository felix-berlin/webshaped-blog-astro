<template></template>

<script setup lang="ts">
import { translationRoutes, currentLanguage } from "@stores/store";

const { localeRoutes, lang } = defineProps({
  localeRoutes: {
    type: Object,
    default: () => ({}),
  },
  lang: {
    type: String,
    required: true,
  },
});

translationRoutes.set(localeRoutes);
currentLanguage.set(lang);
</script>
