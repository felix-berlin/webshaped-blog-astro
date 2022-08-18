<template>
  <header class="wrapper">
    <nav>
      <a href="/">
        <img src="https://cms.webshaped.de/wp-content/uploads/webshaped_logo_2018_rbg_light.svg" alt="Logo">
      </a>
      <ul>
        <li v-for="(item, index) in menuItems.nodes" :class="{'has-child': item.childItems.nodes.length > 0}" :key="index">
            <a :href="item.path" v-if="item.childItems.nodes.length === 0">
              {{ item.label }}
            </a>
            <Menu
              v-else
              :distance="6"
            >
              <span>{{ item.label }}</span>

              <template #popper>
                <template v-for="child in item.childItems.nodes">
                  <a :href="child.path">{{ child.label }}</a>
                </template>
              </template>
            </Menu>
        </li>
      </ul>
    </nav>
    <ColorModeToggle></ColorModeToggle>
  </header>
</template>

<script setup lang="ts">
  // import { props } from '@astrojs/vue';
import ColorModeToggle from "../components/ColorModeToggle.vue";
import { Menu } from 'floating-vue';
import 'floating-vue/dist/style.css';

interface Props {
  menuItems: {
    nodes: [
      {
        label: string;
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

const props = defineProps<Props>()


</script>

<style lang="scss" scoped>

</style>