<template>
  <li
    :class="[
      'c-menu__item',
      {
        'has-child':
          menuItem?.childItems?.nodes && menuItem?.childItems.nodes?.length > 0,
        'is-active': isCurrentPath,
        'has-visible-child': isOpen,
      },
    ]"
    role="menuitem"
  >
    <a
      v-if="!props.menuItem.childItems"
      :href="props.menuItem.path!"
      class="c-menu__link"
      @click="$emit('menuItemTargetClicked', true)"
    >
      {{ props.menuItem.label }}
    </a>

    <!-- If menu item has child -->
    <template v-else>
      <button
        :ref="`menu-title-${depth}${index}`"
        type="button"
        class="c-menu__link is-menu-title"
        :aria-expanded="isOpen"
        :aria-controls="`submenu${depth}${index}`"
        @click="toggleMenuItem()"
      >
        <span class="c-menu__link-title">{{ props.menuItem.label }}</span>
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
        :class="[
          `is-level-${depth} is-${submenuDirection}`,
          { 'is-open': isOpen },
        ]"
      >
        <template
          v-for="(child, childItemIndex) in props.menuItem.childItems.nodes"
          :key="child.label"
        >
          <MenuItem
            :menu-item="child"
            :depth="depth + 1"
            :index="childItemIndex"
            menu-trigger="click"
            @click="
              toggleMenuItem();
              $emit('menuItemTargetClicked', true);
            "
          />
        </template>
      </MenuSubmenu>
    </template>
  </li>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import MenuSubmenu from "@components/menu-nav/MenuSubmenu.vue";
import { onClickOutside } from "@vueuse/core";
import type { MenuItem } from "../../types/generated/graphql";

export interface MenuItemProps {
  menuItem: MenuItem;
  depth: number;
  index: number;
}

const props = defineProps<MenuItemProps>();

const isOpen = ref(false);
const isCurrentPath = ref(false);
const submenu = ref(null);
const submenuDirection = ref("right");

const emit = defineEmits<{
  submenuState: [isOpen: boolean];
  "submenu-state": [isOpen: boolean];
  menuItemTargetClicked: [value: boolean];
  "menu-item-target-clicked": [value: boolean];
}>();

/**
 * Toggle the submenu
 */
const toggleMenuItem = async () => {
  isOpen.value = !isOpen.value;

  emit("submenuState", isOpen.value);

  await nextTick();
  calSubmenuDirection();
};

/**
 * If the user clicks outside the submenu, close the submenu
 *
 * @param   {[type]}  submenu
 * @param   {[type]}  event
 *
 * @return  {void}             [return description]
 */
onClickOutside(submenu, (event): void => {
  if ((event.target as HTMLElement).classList.contains("is-menu-title")) return;

  isOpen.value = false;

  emit("submenuState", isOpen.value);
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
