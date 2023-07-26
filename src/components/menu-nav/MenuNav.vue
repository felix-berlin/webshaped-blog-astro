<template>
  <menu class="c-menu u-list-reset" role="menu">
    <template v-for="(item, index) in props.menuItems" :key="item.label">
      <MenuItem
        :menu-item="item"
        :depth="0"
        :index="index"
        menu-trigger="click"
        @submenu-state="$emit('submenuState', $event)"
        @menu-item-target-clicked="$emit('menuItemTargetClicked', $event)"
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
import type {
  Language,
  MenuItem as MenuItemData,
} from "../../types/generated/graphql";
import { ChevronDown } from "lucide-vue-next";

export interface MenuProps {
  menuItems: MenuItemData[];
}

const props = defineProps<MenuProps>();

defineEmits<{
  submenuState: [isOpen: boolean];
  "submenu-state": [isOpen: boolean];
  menuItemTargetClicked: [value: boolean];
}>();
</script>

<style lang="scss">
@use "@styles/components/menu";
</style>
