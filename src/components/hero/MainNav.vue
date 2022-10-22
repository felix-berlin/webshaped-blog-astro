<template>
  <nav class="c-main-nav">
    <a href="/">
      <img
        src="https://cms.webshaped.de/wp-content/uploads/webshaped_logo_2018_rbg_light.svg"
        alt="Logo"
      >
    </a>
    <menu>
      <li
        v-for="(item, index) in menuItems.nodes"
        :key="index"
        :class="{'has-child': item.childItems.nodes.length > 0}"
      >
        <a
          v-if="item.childItems.nodes.length <= 0"
          :href="item.path"
        >
          {{ item.label }}
        </a>
        <VMenu
          v-else
          :distance="6"
        >
          <span>{{ item.label }}</span>

          <template #popper>
            <template
              v-for="(child, childIndex) in item.childItems.nodes"
              :key="childIndex"
            >
              <a :href="child.path">{{ child.label }}</a>
            </template>
          </template>
        </VMenu>
      </li>
    </menu>
  </nav>
</template>

<script setup lang="ts">
export interface MainNavProps {
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

const props = defineProps<MainNavProps>()
</script>

<style scoped>

</style>
