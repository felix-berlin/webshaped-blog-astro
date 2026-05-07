<template>
  <menu class="c-menu u-list-reset">
    <li
      v-for="item in props.menuItems.nodes"
      :key="item.label!"
      :class="[
        'c-menu__item',
        {
          'has-child': item?.childItems?.nodes && item.childItems.nodes.length > 0,
        },
      ]"
    >
      <a
        v-if="item?.childItems?.nodes && item.childItems.nodes.length <= 0"
        :href="item.path!"
        class="c-menu__link"
      >
        {{ item.label }}
      </a>

      <span v-else class="c-menu__link is-menu-title">
        <span class="c-menu__link-title">{{ item.label }}</span>

        <span v-show="$slots.menuTitleIcon" class="c-menu__link-icon">
          <slot name="menuTitleIcon" />
        </span>
      </span>

      <menu class="c-submenu u-list-reset">
        <li v-for="child in item?.childItems?.nodes" :key="child.label!" class="c-submenu__item">
          <a :href="child.path!" class="c-submenu__link">{{ child.label }}</a>
        </li>
      </menu>
    </li>
  </menu>
</template>

<script setup lang="ts">
import type { RootQueryToMenuItemConnection } from "@/gql/graphql";

export interface MenuProps {
  menuItems: RootQueryToMenuItemConnection;
}

const props = defineProps<MenuProps>();
</script>

<style lang="scss">
@use "@styles/components/menu";
@use "@styles/components/submenu";
</style>
