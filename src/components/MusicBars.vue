<template>
  <span class="o-music-bars">
    <template v-for="(bar, index) in 3" :key="index">
      <span
        class="o-music-bars__bar"
        :class="{ 'is-animated': props.animate }"
      />
    </template>
  </span>
</template>

<script setup lang="ts">
interface MusicBarsProps {
  animate: boolean;
}

const props = withDefaults(defineProps<MusicBarsProps>(), {
  animate: false,
});
</script>

<style lang="scss">
@use "@styles/objects/music-bars";
</style>
