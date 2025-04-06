<template>
  <Transition name="fade">
    <menu v-show="isOpen" role="menu" class="c-submenu u-list-reset">
      <slot />
    </menu>
  </Transition>
</template>

<script setup lang="ts">
export interface MenuSubmenuProps {
  isOpen: boolean;
}
defineProps<MenuSubmenuProps>();
</script>
