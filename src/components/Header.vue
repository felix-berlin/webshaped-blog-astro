<template>
  <header class="o-header wrapper">
    <nav>
      <a href="/">
        <img
          src="https://cms.webshaped.de/wp-content/uploads/webshaped_logo_2018_rbg_light.svg"
          alt="Logo"
        >
      </a>
      <ul>
        <li
          v-for="(item, index) in menuItems.nodes"
          :key="index"
          :class="{'has-child': item.childItems.nodes.length > 0}"
        >
          <a
            v-if="item.childItems.nodes.length === 0"
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
                v-for="(child, index) in item.childItems.nodes"
                :key="index"
              >
                <a :href="child.path">{{ child.label }}</a>
              </template>
            </template>
          </VMenu>
        </li>
      </ul>
    </nav>
    <LanguageSelect />
    <ColorModeToggle />
  </header>
</template>

<script setup lang="ts">
import ColorModeToggle from '@components/ColorModeToggle.vue';
import LanguageSelect from '@components/LanguageSelect.vue';

export interface HeaderProps {
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

const props = defineProps<HeaderProps>()


</script>

<style lang="scss" scoped>

</style>
