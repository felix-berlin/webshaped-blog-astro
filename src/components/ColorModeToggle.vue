<template>
  <button
    type="button"
    class="c-color-mode-toggle"
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
          aria-label="Dunklen Modus aktivieren"
        />
      </template>

      <template
        v-else-if="!state.isDark"
      >
        <Sun
          focusable="false"
          aria-label="Hellen Modus aktivieren"
        />
      </template>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { ref, onMounted, reactive, watch } from 'vue';

const state = reactive({ isDark: false, });

const toggleMode = () => {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  localStorage.setItem('darkMode', isDarkMode ? 'false' : 'true');
  state.isDark = isDarkMode ? false : true;
  state.isDark ? document.querySelector('html')?.classList.add('dark') : document.querySelector('html')?.classList.remove('dark');
}

/**
 * Set theme mode on init page load
 *
 * @return  {[type]}  [return description]
 */
const initTheme = () => {
  if (typeof localStorage !== 'undefined' && !localStorage.getItem('darkMode')) {
    window.matchMedia('(prefers-color-scheme: dark)').matches ? localStorage.setItem('darkMode', 'true') : localStorage.setItem('darkMode', 'false');
  }
}

onMounted(() => {
  initTheme();
  state.isDark = localStorage.getItem('darkMode') === 'true' ? true : false;
})
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
