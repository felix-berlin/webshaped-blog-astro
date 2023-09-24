<template>
  <div :id="id" class="c-search"></div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from "vue";
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

onMounted(() => {
  initPagefind();

  window.addEventListener("keydown", (event) => {
    if (event.key === "/" || event.key === ".") {
      event.preventDefault();
      document?.querySelector("div#search input")?.focus();
    }
  });
});
</script>
<style lang="scss">
@use "@pagefind/default-ui/css/ui.css";
</style>
