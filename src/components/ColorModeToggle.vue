<template>
  <button
    type="button"
    class="c-color-mode-toggle c-button c-button--icon"
    @click="toggleMode()"
  >
    <Transition
      name="fade"
      mode="out-in"
    >
      <template
        v-if="state.isDark"
      >
        <Moon
          focusable="false"
          :aria-label="__('de_DE', 'color_mode_toggle.dark_label')"
        />
      </template>

      <template
        v-else-if="!state.isDark"
      >
        <Sun
          focusable="false"
          :aria-label="__('de_DE', 'color_mode_toggle.light_label')"
        />
      </template>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { ref, onMounted, reactive, watch } from 'vue';
import { __ } from '@i18n/i18n'

const state = reactive({ isDark: false, });

const toggleMode = () => {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  localStorage.setItem('darkMode', isDarkMode ? 'false' : 'true');
  state.isDark = isDarkMode ? false : true;
  state.isDark ? document.querySelector('html')?.classList.add('dark') : document.querySelector('html')?.classList.remove('dark');
}

onMounted(() => {
  state.isDark = localStorage.getItem('darkMode') === 'true' ? true : false;
})
</script>

<style lang="scss">
@use '@styles/components/color-mode-toggle';
</style>
