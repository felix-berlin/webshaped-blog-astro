<template>
  <menu class="c-menu">
    <li
      v-for="(item, index) in props.menuItems.nodes"
      :key="index"
      :class="['c-menu-item', {'has-child': item.childItems.nodes.length > 0}]"
    >
      <a
        v-if="item.childItems.nodes.length <= 0"
        :href="item.path"
        class="c-menu-link"
      >
        {{ item.label }}
      </a>
      <VMenu
        v-else
        :distance="6"
        popper-class="c-menu-dropdown"
      >
        <span class="c-menu-link is-menu-title">{{ item.label }}</span>

        <template #popper>
          <menu class="c-submenu">
            <li
              v-for="(child, childIndex) in item.childItems.nodes"
              :key="childIndex"
              class="c-submenu-item"
            >
              <a
                :href="child.path"
                class="c-submenu-link"
              >{{ child.label }}</a>
            </li>
          </menu>
        </template>
      </VMenu>
    </li>
  </menu>
</template>

<script setup lang="ts">
export interface MenuProps {
  menuItems: {
    nodes: [
      {
        label: string,
        order: number;
        path: string;
        childItems: {
          nodes: [
            {
              label: string;
              order: number;
              path: string;
            }
          ]
        }
      }
    ]
  };
}

const props = defineProps<MenuProps>()

</script>

<style lang="scss">
@use '@styles/components/menu';
</style>
