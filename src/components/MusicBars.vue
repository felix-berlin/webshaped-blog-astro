<template>
  <span class="o-music-bars">
    <span
      v-for="bar in 3"
      :key="bar"
      class="o-music-bars__bar"
      :class="{ 'is-animated': animate }"
    />
  </span>
</template>

<script setup lang="ts">
interface MusicBarsProps {
  animate?: boolean;
}

const { animate = false } = defineProps<MusicBarsProps>();
</script>

<style lang="scss">
@use "@styles/objects/music-bars";
</style>
