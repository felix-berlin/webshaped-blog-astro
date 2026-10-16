<template>
  <menu class="c-menu u-list-reset" role="menu">
    <MenuItem
      v-for="(item, index) in menuItems"
      :key="item.label ?? index"
      :menu-item="item"
      :depth="0"
      :index="index"
      :has-child="!!item.childItems?.nodes.length"
      @submenu-state="emit('submenu-state', $event)"
      @menu-item-target-clicked="emit('menu-item-target-clicked')"
    >
      <template v-if="item.childItems?.nodes.length" #menuTitleIcon>
        <ChevronDown class="c-main-nav__menu-icon is-mobile" />
      </template>
    </MenuItem>
  </menu>
</template>

<script setup lang="ts">
import MenuItem from "@components/menu-nav/MenuItem.vue";
import ChevronDown from "virtual:icons/lucide/chevron-down";

export interface MenuNode {
  childItems?: null | { nodes: MenuNode[] };
  label: null | string;
  order?: null | number;
  path: null | string;
}

export interface MenuProps {
  menuItems: MenuNode[];
}

const { menuItems } = defineProps<MenuProps>();

const emit = defineEmits<{
  "menu-item-target-clicked": [];
  "submenu-state": [isOpen: boolean];
}>();
</script>

<style lang="scss">
@use "@styles/components/menu";
</style>
