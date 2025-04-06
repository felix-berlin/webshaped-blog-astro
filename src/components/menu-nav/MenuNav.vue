<template>
  <menu class="c-menu u-list-reset" role="menu">
    <template v-for="(item, index) in menuItems" :key="item.label">
      <MenuItem
        :menu-item="item"
        :depth="0"
        :index="index"
        :has-child="(item?.childItems?.nodes ?? []).length > 0"
        @submenu-state="emit('submenu-state', $event)"
        @menu-item-target-clicked="emit('menu-item-target-clicked', $event)"
      >
        <template #menuTitleIcon v-if="item.childItems && item.childItems.nodes.length > 0">
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

const { menuItems } = defineProps<MenuProps>();

const emit = defineEmits<{
  "submenu-state": [isOpen: boolean];
  "menu-item-target-clicked": [value: number];
}>();
</script>

<style lang="scss">
@use "@styles/components/menu";
</style>
