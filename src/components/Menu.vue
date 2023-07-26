<template>
  <menu class="c-menu u-list-reset">
    <li
      v-for="item in props.menuItems.nodes"
      :key="item"
      :class="[
        'c-menu__item',
        {
          'has-child':
            item?.childItems?.nodes && item.childItems.nodes.length > 0,
        },
      ]"
    >
      <a
        v-if="item?.childItems?.nodes && item.childItems.nodes.length <= 0"
        :href="item.path + (!!item?.path?.match(/\/category\//gm) ? '1' : '')"
        class="c-menu__link"
      >
        {{ item.label }}
      </a>

      <span class="c-menu__link is-menu-title">
        <span>{{ item.label }}</span>
        <ChevronDown :size="18" />
      </span>

      <menu class="c-submenu u-list-reset">
        <li
          v-for="child in item?.childItems?.nodes"
          :key="child"
          class="c-submenu__item"
        >
          <a
            :href="
              child.path +
              (child?.path?.match(/\/category\//gm)?.length ? '1' : '')
            "
            class="c-submenu__link"
            >{{ child.label }}</a
          >
        </li>
      </menu>

    </li>
  </menu>
</template>

<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
import type { Language, Maybe, MenuToMenuItemConnection } from "../types/generated/graphql";

export interface MenuProps {
  menuItems: MenuToMenuItemConnection;
}

const props = defineProps<MenuProps>();
</script>

<style lang="scss">
@use "@styles/components/menu";
@use "@styles/components/submenu";
</style>
