<template>
  <li
    :class="[
      'c-menu__item',
      {
        'has-child':
          props.menuItem.childItems && props.menuItem.childItems.length > 0,
        'is-active': isCurrentPath,
        'has-visible-child': isOpen,
      },
    ]"
    role="menuitem"
    tabindex="-1"
  >
    <a
      v-if="!props.menuItem.childItems"
      :href="props.menuItem.path!"
      class="c-menu__link"
      @click="$emit('menuItemTargetClicked', true)"
    >
      {{ props.menuItem.label }}
    </a>

    <template v-else>
      <a
        :ref="`menu-title-${depth}${index}`"
        class="c-menu__link is-menu-title"
        role="button"
        tabindex="0"
        @click="handleClick()"
        @keydown="handleClick()"
        @mouseover="handleMouseOver()"
        @focus="handleMouseOver()"
      >
        {{ props.menuItem.label }}
      </a>

      <span v-if="$slots.menuTitleIcon" class="c-menu__link-icon" :class="{'has-submenu-open': isOpen}">
        <slot name="menuTitleIcon" />
      </span>

      <MenuSubmenu
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
import { ref, onMounted } from "vue";
import MenuSubmenu from "@components/menu-nav/MenuSubmenu.vue";
import { onClickOutside } from "@vueuse/core";
import type { Language, MenuItem } from "../../types/generated/graphql";

export interface MenuItemProps {
  menuItem: MenuItem;
  depth: number;
  index: number;
  menuTrigger: 'click' | 'hover' | 'both';
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
 * If the user clicks outside the submenu, close the submenu
 *
 * @param   {[type]}  submenu
 * @param   {[type]}  event
 *
 * @return  {void}             [return description]
 */
onClickOutside(submenu, (event): void => {
  if ((event.target as Element).classList.contains("is-menu-title")) return;

  isOpen.value = false;

  emit("submenuState", isOpen.value);
});

const handleClick = () => {
  if (String(props.menuTrigger) === 'click' || String(props.menuTrigger) === 'both') toggleMenuItem();
};

const handleMouseOver = () => {
  if (String(props.menuTrigger) === 'hover' || String(props.menuTrigger) === 'both') toggleMenuItem();
};

/**
 * Toggle the submenu
 *
 * @return  {void}
 */
const toggleMenuItem = (): void => {
  isOpen.value = !isOpen.value;

  emit("submenuState", isOpen.value);
  setTimeout(() => {
    const submenuEl = document.querySelector(".c-submenu");
    const submenuRect = submenuEl?.getBoundingClientRect();
    const left = submenuRect?.left;
    const width = submenuRect?.width;
    const windowWidth = window.innerWidth;

    submenuDirection.value =
      left !== undefined && width !== undefined && left + width > windowWidth
        ? "left"
        : "right";
  }, 100);
};
</script>
