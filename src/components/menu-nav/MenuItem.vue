<template>
  <li
    :class="[
      'c-menu__item',
      {
        'has-child': hasChild,
        'is-active': isCurrentPath,
        'has-visible-child': isOpen,
      },
    ]"
    role="menuitem"
  >
    <a
      v-if="!hasChild"
      :href="menuItem.path!"
      class="c-menu__link"
      :class="`is-level-${depth}`"
      @click="$emit('menu-item-target-clicked', depth, index, true)"
      @mouseenter="$emit('menu-item-target-clicked', depth, index, true)"
      @focus="$emit('menu-item-target-clicked', depth, index, true)"
    >
      {{ menuItem.label }}
    </a>

    <!-- If menu item has child -->
    <template v-else>
      <button
        :ref="`menu-title-${depth}${index}`"
        type="button"
        class="c-menu__link is-menu-title"
        :class="`is-level-${depth}`"
        :aria-expanded="isOpen"
        :aria-controls="`submenu${depth}${index}`"
        @click="toggleMenuItem(depth, index)"
        @mouseenter="toggleMenuItem(depth, index)"
        @focus="toggleMenuItem(depth, index)"
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
        <template v-for="(child, childItemIndex) in menuItem?.childItems?.nodes" :key="child.label">
          <MenuItem
            :menu-item="child"
            :depth="depth + 1"
            :index="childItemIndex"
            :has-child="(child?.childItems?.nodes ?? []).length > 0"
            @mouseenter="child?.childItems ? null : toggleMenuItem(depth + 1, childItemIndex)"
            @click="child?.childItems ? null : toggleMenuItem(depth + 1, childItemIndex)"
            @focus="child?.childItems ? null : toggleMenuItem(depth + 1, childItemIndex)"
          />
        </template>
      </MenuSubmenu>
    </template>
  </li>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import MenuSubmenu from "@components/menu-nav/MenuSubmenu.vue";
import { onClickOutside } from "@vueuse/core";
import type { MenuItem } from "@ts_types/generated/graphql";

export interface MenuItemProps {
  menuItem: MenuItem;
  depth: number;
  index: number;
  hasChild: boolean;
}

const { menuItem, depth, index, hasChild } = defineProps<MenuItemProps>();

const isOpen = ref(false);
const isCurrentPath = ref(false);
const submenu = ref(null);
const submenuDirection = ref("right");

const emit = defineEmits<{
  "submenu-state": [isOpen: boolean];
  "menu-item-target-clicked": [depth: number, index: number, value: boolean];
}>();

/**
 * Toggle the menu item
 *
 * @return  {Promise<void>}
 */
const toggleMenuItem = async (
  itemDepth: number,
  itemIndex: number,
  sendEmit?: boolean,
): Promise<void> => {
  if (itemDepth !== depth || itemIndex !== index) return;

  isOpen.value = !isOpen.value;

  if (sendEmit) {
    emit("menu-item-target-clicked", depth, index, true);
  }

  await openSubmenu();
};

/**
 * Open the submenu
 *
 * @return  {<Promise><void>}
 */
const openSubmenu = async (): Promise<void> => {
  emit("submenu-state", isOpen.value);

  await nextTick();
  calSubmenuDirection();
};

/**
 * If the user clicks outside the submenu, close the submenu
 *
 * @param   {[type]}  submenu
 * @param   {PointerEvent}  event
 *
 * @return  {void}             [return description]
 */
onClickOutside(submenu, (event: PointerEvent): void => {
  const target = event.target as HTMLElement;

  if (target.classList.contains("is-menu-title")) return;

  isOpen.value = false;
  emit("submenu-state", isOpen.value);
});

/**
 * Set the submenu direction
 *
 * @return  {void}
 */
const calSubmenuDirection = (): void => {
  const submenuEl = document.querySelector(".c-submenu");

  if (!submenuEl) return;

  const { left, width } = submenuEl.getBoundingClientRect();
  const windowWidth = window.innerWidth;

  submenuDirection.value = left + width > windowWidth ? "left" : "right";
};
</script>
