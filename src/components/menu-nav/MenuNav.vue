<template>
  <menu class="c-menu u-list-reset" role="menu">
    <template v-for="(item, index) in props.menuItems" :key="item.label">
      <MenuItem
        :menu-item="item"
        :depth="0"
        :index="index"
        @submenu-state="$emit('submenu-state', $event)"
        @menu-item-target-clicked="$emit('menu-item-target-clicked', $event)"
      >
        <template #menuTitleIcon>
          <ChevronDown class="c-main-nav__menu-icon is-mobile" />
        </template>
      </MenuItem>
    </template>
  </menu>
</template>

<script setup lang="ts">
import MenuItem from "@components/menu-nav/MenuItem.vue";
import type { MenuItem as MenuItemData } from "@ts_types/generated/graphql";
import ChevronDown from "virtual:icons/lucide/chevron-down";

export interface MenuProps {
  menuItems: MenuItemData[];
}

const props = defineProps<MenuProps>();

defineEmits<{
  "submenu-state": [isOpen: boolean];
  "menu-item-target-clicked": [value: boolean];
}>();
</script>

<style lang="scss">
@use "@styles/components/menu";
</style>
