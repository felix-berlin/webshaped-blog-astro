<template>
  <component :is="element" :class="[componentClass, `${componentClass}--${type}`]" role="alert">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface AlertProps {
  componentClass?: string;
  element?: string;
  type?: "danger" | "info" | "success" | "warning";
}

const { componentClass = "c-alert", element = "div", type = "info" } = defineProps<AlertProps>();
</script>

<style lang="scss">
@use "@styles/components/alert.scss";
</style>
