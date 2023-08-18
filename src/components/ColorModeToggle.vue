<template>
  <button
    type="button"
    class="c-color-mode-toggle c-button c-button--icon"
    @click="toggleMode()"
  >
    <Transition name="fade" mode="out-in">
      <template v-if="isDark">
        <Moon
          focusable="false"
          :aria-label="__(lang?.locale, 'color_mode_toggle.dark_label')"
        />
      </template>

      <template v-else-if="!isDark">
        <Sun
          focusable="false"
          :aria-label="__(lang?.locale, 'color_mode_toggle.light_label')"
        />
      </template>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import Moon from "virtual:icons/lucide/moon";
import Sun from "virtual:icons/lucide/sun";
import { useStore } from "@nanostores/vue";
import { isDarkMode, currentLanguage } from "@stores/store";
import { __ } from "@i18n/i18n";

const isDark = useStore(isDarkMode);
const lang = useStore(currentLanguage);

const toggleMode = () => {
  isDarkMode.set(!isDark.value);

  if (isDark.value) {
    document.querySelector("html")?.classList.add("dark");
  } else {
    document.querySelector("html")?.classList.remove("dark");
  }
};
</script>

<style lang="scss">
@use "@styles/components/color-mode-toggle";
</style>
