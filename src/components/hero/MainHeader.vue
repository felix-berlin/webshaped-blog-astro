<template>
  <header class="o-header">
    <MainNav :menu-items="props.menuItems" />
    <!-- <LanguageSelect class="is-desktop" /> -->
    <ColorModeToggle class="is-desktop" />
  </header>
</template>

<script setup lang="ts">
import ColorModeToggle from '@components/ColorModeToggle.vue';
import LanguageSelect from '@components/LanguageSelect.vue';
import MainNav from '@components/hero/MainNav.vue';

export interface HeaderProps {
  menuItems: {
    nodes: [
      {
        label: string;
        order: number;
        path: string;
        childItems: {
          nodes: [
            {
              label: string;
              order: number;
              path: string;
            }
          ]
        }
      }
    ]
  };
}

const props = defineProps<HeaderProps>()


</script>

<style lang="scss">
</style>
