<template></template>

<script setup lang="ts">
import { translationRoutes } from "@stores/store";

const { localeRoutes } = defineProps({
  localeRoutes: {
    type: Object,
    default: () => ({}),
  },
});

translationRoutes.set(localeRoutes);
</script>
