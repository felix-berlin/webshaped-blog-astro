<template>
  <nav class="c-main-nav">
    <a
      href="/"
      class="c-main-nav__logo-link"
    >
      <img
        class="c-main-nav__logo"
        src="https://cms.webshaped.de/wp-content/uploads/webshaped_logo_2018_rbg_light.svg"
        alt="Logo"
        width="125"
        height="40"
      >
    </a>
    <Menu
      :menu-items="props.menuItems"
      class="is-desktop"
    />
    <VMenu
      :distance="6"
      popper-class="c-menu-dropdown"
    >
      <span class="c-menu-link is-menu-title"><MenuIcon :size="40" /></span>

      <template #popper>
        <button v-close-popper>
          <X />
        </button>

        <Menu
          :menu-items="props.menuItems"
          class="is-mobile"
        />

        <LanguageSelect />
        <ColorModeToggle />
      </template>
    </VMenu>
  </nav>
</template>

<script setup lang="ts">
import Menu from '@components/Menu.vue';
import ColorModeToggle from '@components/ColorModeToggle.vue';
import LanguageSelect from '@components/LanguageSelect.vue';
import { Menu as MenuIcon, X } from 'lucide-vue-next';

export interface MainNavProps {
  menuItems: {
    nodes: [
      {
        label: string,
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

const props = defineProps<MainNavProps>()
</script>

<style lang="scss">
@use '@styles/components/main-nav';
</style>
