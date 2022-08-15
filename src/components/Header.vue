<template>
  <header class="wrapper">
    <nav>
      <a href="/">Home</a>
      <ul v-for="(item, index) in menuItems.edges">
        <li :key="index">
            <a :href=" '/' + item.node.connectedNode.node.slug">
              {{ item.node.label }}
            </a>
        </li>
      </ul>
    </nav>
    <ColorModeToggle></ColorModeToggle>
  </header>
</template>

<script setup lang="ts">
  // import { props } from '@astrojs/vue';
import ColorModeToggle from "../components/ColorModeToggle.vue";

const props = defineProps ({
  menuItems: {
    type: Object,
    default: () => {},
  },
})


</script>

<style lang="scss" scoped>

</style>