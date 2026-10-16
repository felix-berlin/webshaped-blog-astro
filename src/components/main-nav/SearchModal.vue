<template>
  <button class="c-searchbar c-button c-button--outline" type="button" @click="openSearch">
    <SearchIcon class="c-searchbar__search-icon" />
    <span class="c-searchbar__label">{{ t("search") }}</span>
    <SquareSlash class="c-searchbar__slash-icon" />
  </button>

  <Modal
    :uid="searchId"
    :lang="lang"
    :open="searchVisible"
    position="top"
    :disable-scroll="true"
    @close="searchVisible = false"
  >
    <!-- Pagefind UI is only loaded once the search is first opened. -->
    <Search v-if="searchLoaded" :id="searchId" autofocus />
  </Modal>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import Modal from "@components/Modal.vue";
import { useEventListener } from "@vueuse/core";
import SearchIcon from "virtual:icons/lucide/search";
import SquareSlash from "virtual:icons/lucide/square-slash";
import { defineAsyncComponent, nextTick, ref } from "vue";

import { useI18n } from "@/composables/useI18n";

const Search = defineAsyncComponent(() => import("@components/Search.vue"));

const { lang } = defineProps<{ lang: Lang }>();
const searchId = "main-search";
const searchVisible = ref(false);
const searchLoaded = ref(false);
const { t } = useI18n(() => lang);

const openSearch = async (): Promise<void> => {
  searchVisible.value = true;
  searchLoaded.value = true;
  // On later openings Search is already mounted, so focus its input directly.
  await nextTick();
  document.querySelector<HTMLInputElement>(`#${searchId} input`)?.focus();
};

// "/" or "." opens the search from anywhere except while typing into a field.
useEventListener(window, "keydown", (event: KeyboardEvent) => {
  const activeTag = document.activeElement?.tagName;
  if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;
  if (event.key !== "/" && event.key !== ".") return;

  event.preventDefault();
  void openSearch();
});
</script>

<style lang="scss">
@use "@styles/components/searchbar.scss";
</style>
