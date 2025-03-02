<template>
  <div :id="id" class="c-search"></div>
  <!-- <input type="text" ref="searchInput" @focus="initPagefind" @keydown="processResults" /> -->
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, ref, useTemplateRef } from "vue";
import { PagefindUI } from "@pagefind/default-ui";

export interface SearchProps {
  id: string;
}

const { id } = defineProps<SearchProps>();
// const searchInput = useTemplateRef("searchInput");
const pagefind = ref(null);

let bundlePath = `/pagefind/`;

if (import.meta.env.DEV) {
  bundlePath = "/dist/pagefind/";
  console.warn(
    "If there are no search results, make sure you have run `npm run build` and that the `dist/pagefind` folder exists.",
  );
}

/**
 * Initialize Pagefind
 *
 */
const initPagefind = async () => {
  // if (!searchInput.value) return;
  // pagefind.value = await import("../../public/pagefind/pagefind.js");
  // console.log(pagefind.value);
  // pagefind.value.init();
  new PagefindUI({
    element: `#${id}`,
    resetStyles: false,
    showImages: false,
  });
};

const processResults = async (event) => {
  const results = await (await pagefind.value.search(event.target.value)).results;
  for (const result of results) {
    const data = await result.data();
    console.log(data, data.meta.title, data.excerpt);
    // do required DOM manipulation
  }
};

/**
 * Trigger search via keyboard
 *
 * @param   {KeyboardEvent}  event
 *
 * @return  {void}
 */
const triggerSearchViaKeyboard = (event: KeyboardEvent): void => {
  const activeElement = document.activeElement?.tagName;
  // If input or textarea is focused, do nothing
  if (activeElement === "INPUT" || activeElement === "TEXTAREA") return;

  if (!(event.key === "/" || event.key === ".")) {
    return;
  }
  event.preventDefault();
  const inputElement = document?.querySelector(`#${id} input`) as HTMLElement;
  inputElement?.focus();
};

onMounted(() => {
  nextTick(() => {
    initPagefind();
  });

  window.addEventListener("keydown", (event) => triggerSearchViaKeyboard(event));
});

onUnmounted(() => {
  window.removeEventListener("keydown", (event) => triggerSearchViaKeyboard(event));
});
</script>
<style lang="scss">
@use "@pagefind/default-ui/css/ui.css";
</style>
