<template>
  <div class="c-tab-toggle">
    <button
      v-for="(item, index) in slotChildLength"
      :key="index"
      class="c-tab-toggle__toggle"
      @click="toggle(index)"
    >
      {{ buttonLabels[index] }}
    </button>

    <div ref="tabToggle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

export interface TabToggleProps {
  buttonLabels: string[];
}

defineProps<TabToggleProps>();

const tabToggle = ref(null);

/**
 * Get the number of children in the slot
 * "childNodes[1]" is a element "astro-slot" who wrap the slot
 *
 * @return  {[type]}  [return description]
 */
const slotChildLength = computed(() => {
  return tabToggle?.value?.childNodes[1].childNodes.length;
});

/**
 * The tab nodes
 *
 * @return  {Node}
 */
const tabs = computed((): Node => {
  return tabToggle?.value?.childNodes[1].childNodes;
});

/**
 * Toggle the tabs
 *
 * @param   {number}  index
 *
 * @return  {void}
 */
const toggle = (index: number): void => {
  for (let i = 0; i < tabs.value.length; i++) {
    const child = tabs.value[i] as HTMLElement;

    child.style.display = i === index ? "block" : "none";
  }
};

/**
 * Add classes to the content of the tabs
 *
 * @return  {void}
 */
const addContentClasses = (): void => {
  for (const [index, childNode] of tabs.value.entries()) {
    const child = childNode as HTMLElement;

    child.classList.add("c-tab-toggle__content");
    child.classList.add(`c-tab-toggle__content--${index}`);
  }
};

onMounted(() => {
  // Show the first tab by default
  addContentClasses();
  toggle(0);
});
</script>

<style scoped></style>
