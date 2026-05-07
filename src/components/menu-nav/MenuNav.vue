<template>
  <menu
    class="c-menu u-list-reset"
    role="menu"
  >
    <template
      v-for="(item, index) in menuItems"
      :key="item.label"
    >
      <MenuItem
        :menu-item="item"
        :depth="0"
        :index="index"
        :has-child="(item?.childItems?.nodes ?? []).length > 0"
        @submenu-state="emit('submenu-state', $event)"
        @menu-item-target-clicked="emit('menu-item-target-clicked', $event)"
      >
        <template
          v-if="item.childItems && item.childItems.nodes.length > 0"
          #menuTitleIcon
        >
          <ChevronDown class="c-main-nav__menu-icon is-mobile" />
        </template>
      </MenuItem>
    </template>
  </menu>
</template>

<script setup lang="ts">
import MenuItem from "@components/menu-nav/MenuItem.vue";
import ChevronDown from "virtual:icons/lucide/chevron-down";

import type { MenuItem as MenuItemData } from "@/gql/graphql.ts";

export interface MenuProps {
  menuItems: MenuItemData[];
}

const { menuItems } = defineProps<MenuProps>();

const emit = defineEmits<{
  "menu-item-target-clicked": [value: number];
  "submenu-state": [isOpen: boolean];
}>();
</script>

<style lang="scss">
@use "@styles/components/menu";
</style>
