<template>
  <a href="/" class="c-logo">
    <img
      :src="`/assets/logo/web_shaped_logo_2023_${
        isDark ? 'light' : 'dark'
      }.svg`"
      alt="Web Shaped Logo"
      width="250"
      height="34"
      loading="eager"
      fetchpriority="high"
    />
  </a>
</template>

<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { isDarkMode } from "@stores/store";

const isDark = useStore(isDarkMode);
</script>

<style lang="scss">
@use "@styles/components/logo";
</style>
