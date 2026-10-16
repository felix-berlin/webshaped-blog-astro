<template>
  <li
    ref="item"
    :class="[
      'c-menu__item',
      {
        'has-child': hasChild,
        'has-visible-child': isOpen,
      },
    ]"
    role="menuitem"
  >
    <a
      v-if="!hasChild"
      :href="menuItem.path ?? undefined"
      class="c-menu__link"
      :class="`is-level-${depth}`"
      @click="$emit('menu-item-target-clicked')"
    >
      {{ menuItem.label }}
    </a>

    <!-- If menu item has child -->
    <template v-else>
      <button
        type="button"
        class="c-menu__link is-menu-title"
        :class="`is-level-${depth}`"
        :aria-expanded="isOpen"
        :aria-controls="`submenu${depth}${index}`"
        @click="toggleMenuItem"
        @mouseenter="toggleMenuItem"
        @focus="toggleMenuItem"
      >
        <span class="c-menu__link-title">{{ menuItem.label }}</span>
        <span
          v-show="$slots.menuTitleIcon"
          class="c-menu__link-icon"
          :class="{ 'has-submenu-open': isOpen }"
        >
          <slot name="menuTitleIcon" />
        </span>
      </button>

      <MenuSubmenu
        :id="`submenu${depth}${index}`"
        ref="submenu"
        :is-open="isOpen"
        :class="[`is-level-${depth} is-${submenuDirection}`, { 'is-open': isOpen }]"
      >
        <MenuItem
          v-for="(child, childItemIndex) in menuItem.childItems?.nodes"
          :key="child.label ?? childItemIndex"
          :menu-item="child"
          :depth="depth + 1"
          :index="childItemIndex"
          :has-child="!!child.childItems?.nodes.length"
        />
      </MenuSubmenu>
    </template>
  </li>
</template>

<script setup lang="ts">
import type { MenuNode } from "@components/menu-nav/MenuNav.vue";

import MenuSubmenu from "@components/menu-nav/MenuSubmenu.vue";
import { onClickOutside } from "@vueuse/core";
import { nextTick, ref, useTemplateRef } from "vue";

export interface MenuItemProps {
  depth: number;
  hasChild: boolean;
  index: number;
  menuItem: MenuNode;
}

const { depth, hasChild, index, menuItem } = defineProps<MenuItemProps>();

const isOpen = ref(false);
const item = useTemplateRef<HTMLLIElement>("item");
const submenu = useTemplateRef("submenu");
const submenuDirection = ref("right");

const emit = defineEmits<{
  "menu-item-target-clicked": [];
  "submenu-state": [isOpen: boolean];
}>();

/** Flip the submenu to the left if it would overflow the viewport on the right. */
const calSubmenuDirection = (): void => {
  const submenuEl = item.value?.querySelector(".c-submenu");
  if (!submenuEl) return;

  const { left, width } = submenuEl.getBoundingClientRect();
  submenuDirection.value = left + width > window.innerWidth ? "left" : "right";
};

const toggleMenuItem = async (): Promise<void> => {
  isOpen.value = !isOpen.value;
  emit("submenu-state", isOpen.value);

  if (!isOpen.value) return;
  await nextTick();
  calSubmenuDirection();
};

// Only items with a submenu can be open, so only they need to watch outside clicks.
if (hasChild) {
  onClickOutside(submenu, (event: PointerEvent): void => {
    if ((event.target as HTMLElement).classList.contains("is-menu-title")) return;

    isOpen.value = false;
    emit("submenu-state", false);
  });
}
</script>
