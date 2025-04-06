<template>
  <a href="/" class="c-logo">
    <img
      :src="src"
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
// import { computed } from "vue";

const isDark = useStore(isDarkMode);

// TODO: Replace after lightmode is final: #9
// const src = computed(() => {
//   return `/assets/logo/web_shaped_logo_2023_${isDark ? "light" : "dark"}.svg`;
// });
const src = "/assets/logo/web_shaped_logo_2023_light.svg";
</script>

<style lang="scss">
@use "@styles/components/logo";
</style>
