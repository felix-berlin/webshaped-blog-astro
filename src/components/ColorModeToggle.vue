<template>
  <button type="button" class="c-color-mode-toggle c-button c-button--icon" @click="toggleMode()">
    <Transition name="fade" mode="out-in">
      <template v-if="isDark">
        <Moon focusable="false" :aria-label="t('color_mode_toggle.dark_label')" />
      </template>

      <template v-else-if="!isDark">
        <Sun focusable="false" :aria-label="t('color_mode_toggle.light_label')" />
      </template>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import Moon from "virtual:icons/lucide/moon";
import Sun from "virtual:icons/lucide/sun";
import { useStore } from "@nanostores/vue";
import { isDarkMode } from "@stores/store";
import { useI18n } from "@/composables/useI18n";

const isDark = useStore(isDarkMode);
const { t } = useI18n();

/**
 * Toggle the color mode.
 *
 * @return  {void}
 */
const toggleMode = (): void => {
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
