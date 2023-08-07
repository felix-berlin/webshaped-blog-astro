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

    <div ref="tabToggle" class="c-tab-toggle__content-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

export interface TabToggleProps {
  buttonLabels: string[];
}

defineProps<TabToggleProps>();

const tabToggle = ref<HTMLDivElement | null>(null);
const hasAstroSlot = ref(false);

/**
 * Get the number of children in the slot
 * "childNodes[1]" is a element "astro-slot" who wrap the slot
 *
 * @return  {[type]}  [return description]
 */
const slotChildLength = ref(0);

/**
 * The tab nodes
 *
 * @return  {void}
 */
const tabs = ref<NodeListOf<ChildNode> | null>(null);

/**
 * Toggle the tabs
 *
 * @param   {number}  index
 *
 * @return  {void}
 */
const toggle = (index: number): void => {
  if (tabs?.value) {
    const tabsArray = Array.from(tabs.value);
    for (const child of tabsArray) {
      (child as HTMLElement).style.display =
        child === tabs?.value?.[index] ? "block" : "none";
    }
  }
};

/**
 * Add classes to the content of the tabs
 *
 * @return  {void}
 */
const addContentClasses = (): void => {
  if (tabs?.value) {
    const tabsArray = Array.from(tabs.value);
    for (const [index, childNode] of tabsArray.entries()) {
      const child = childNode as HTMLElement;

      child.classList.add("c-tab-toggle__content");
      child.classList.add(`c-tab-toggle__content--${index}`);
    }
  }
};

onMounted(() => {
  hasAstroSlot.value = Array.from(tabToggle?.value?.childNodes || []).some(
    (node): node is Element => (node as HTMLElement).tagName === "ASTRO-SLOT",
  );
  const childElements = Array.from(tabToggle?.value?.childNodes || []).filter(
    (node) => node.nodeType !== 3,
  );

  if (hasAstroSlot.value) {
    slotChildLength.value = childElements[0]?.childNodes?.length || 0;
    tabs.value = childElements[0]?.childNodes || null;
  } else {
    slotChildLength.value = childElements?.length || 0;
    tabs.value = childElements || null;
  }

  addContentClasses();
  // Show the first tab by default
  toggle(0);
});
</script>

<style scoped></style>
