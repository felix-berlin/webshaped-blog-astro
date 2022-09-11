<template>
  <button
    type="button"
    class="c-color-mode-toggle"
    @click="toggle()"
  >
    <Transition
      name="fade"
      mode="out-in"
    >
      <template
        v-if="isDark"
      >
        <Moon
          focusable="false"
          aria-label="Dunklen Modus aktivieren"
        />
      </template>

      <template
        v-else-if="!isDark"
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
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sun } from 'lucide-vue-next'

const isDark = useDark({
  selector: 'body',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggle = useToggle(isDark)
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
