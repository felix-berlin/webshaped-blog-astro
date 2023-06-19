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
  element?: string;
  type: "success" | "danger" | "warning" | "info";
  componentClass?: string;
}

const props = withDefaults(defineProps<AlertProps>(), {
  element: "div",
  type: "info",
  componentClass: "c-alert",
});
</script>

<style lang="scss">
@use "@styles/variables/colors";

.c-alert {
  --size-font: inherit;

  color: var(--color, unset);

  @each $name, $color in colors.$alert-colors {
    &--#{$name} {
      --color: #{$color};
    }
  }
}
</style>
