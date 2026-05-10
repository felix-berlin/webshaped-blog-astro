<template>
  <component
    :is="props.element"
    :class="[props.componentClass, props.componentClass + '--' + props.type]"
    role="alert"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface AlertProps {
  componentClass?: string;
  element?: string;
  type?: "danger" | "info" | "success" | "warning";
}

const props = withDefaults(defineProps<AlertProps>(), {
  componentClass: "c-alert",
  element: "div",
  type: "info",
});
</script>

<style lang="scss">
@use "@styles/components/alert.scss";
</style>
