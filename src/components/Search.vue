<template>
  <div :id="id" class="c-search"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { PagefindUI } from "@pagefind/default-ui";

export interface SearchProps {
  id: string;
}

const props = defineProps<SearchProps>();

let bundlePath = `${import.meta.env.BASE_URL}pagefind/`;

if (import.meta.env.DEV) {
  bundlePath = "/dist/pagefind/";
  console.warn(
    "If there are no search results, make sure you have run `npm run build` and that the `dist/pagefind` folder exists.",
  );
}

const initPagefind = () => {
  new PagefindUI({
    element: `#${props.id}`,
    resetStyles: false,
    showImages: false,
    bundlePath,
  });
};

const triggerSearchViaKeyboard = (event: KeyboardEvent) => {
  if (event.key === "/" || event.key === ".") {
    event.preventDefault();
    const inputElement = document?.querySelector(
      `#${props.id} input`,
    ) as HTMLElement;
    inputElement?.focus();
  }
};

onMounted(() => {
  initPagefind();

  window.addEventListener("keydown", (event) =>
    triggerSearchViaKeyboard(event),
  );
});

onUnmounted(() => {
  window.removeEventListener("keydown", (event) =>
    triggerSearchViaKeyboard(event),
  );
});
</script>
<style lang="scss">
@use "@pagefind/default-ui/css/ui.css";
</style>
