<template>
  <component
    :is="data.element"
    :class="[data.componentClass, data.componentClass + '--' + data.type]"
    role="alert"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">

interface AlertProps {
  element?: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  componentClass?: string;
}

const props = defineProps<AlertProps>()

const data = {
  element: props.element ?? 'div',
  type: props.type ?? '',
  componentClass: props.componentClass ?? 'c-alert',
}
</script>

<style lang="scss">
@use '../styles/variables/colors';

.c-alert {
	--color: unset;
	--size-font: inherit;

	color: var(--color);

  @each $name, $color in colors.$alert-colors {
    &--#{$name} {
      --color: #{$color};
    }
  }
}
</style>
