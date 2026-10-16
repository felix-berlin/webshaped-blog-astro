<template>
  <div :id="id" class="c-search" />
</template>

<script setup lang="ts">
import { PagefindUI } from "@pagefind/default-ui";
import { onMounted } from "vue";

export interface SearchProps {
  /** Focus the search input once Pagefind has rendered it. */
  autofocus?: boolean;
  id: string;
}

const { autofocus = false, id } = defineProps<SearchProps>();

if (import.meta.env.DEV) {
  console.warn(
    "If there are no search results, make sure you have run `pnpm build` and that the `dist/pagefind` folder exists.",
  );
}

onMounted(() => {
  new PagefindUI({
    bundlePath: import.meta.env.DEV ? "/pagefind/" : `${import.meta.env.BASE_URL}pagefind/`,
    element: `#${id}`,
    resetStyles: false,
    showImages: false,
  });

  if (autofocus) document.querySelector<HTMLInputElement>(`#${id} input`)?.focus();
});
</script>

<style lang="scss">
@use "@pagefind/default-ui/css/ui.css";
</style>
