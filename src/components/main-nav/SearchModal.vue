<template>
  <button class="c-searchbar c-button c-button--outline" type="button" @click="openSearch">
    <SearchIcon class="c-searchbar__search-icon" />
    <span class="c-searchbar__label">{{ t("search") }}</span>
    <SquareSlash class="c-searchbar__slash-icon" />
  </button>

  <Modal
    :uid="searchId"
    :open="searchVisible"
    position="top"
    :disable-scroll="true"
    @close="searchVisible = false"
  >
    <Search :id="searchId" />
  </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import Modal from "@components/Modal.vue";
import Search from "@components/Search.vue";
import SearchIcon from "virtual:icons/lucide/search";
import SquareSlash from "virtual:icons/lucide/square-slash";
import { useI18n } from "@/composables/useI18n";

const searchId = "main-search";
const searchVisible = ref(false);
const { t } = useI18n();

/**
 * Open the search modal
 *
 * @return  {void}
 */
const openSearch = (): void => {
  searchVisible.value = true;
  focusSearch();
};

/**
 * Focus the search input
 *
 * @return  {void}
 */
const focusSearch = (): void => {
  nextTick(() => {
    const inputElement = document?.querySelector(`#${searchId} input`) as HTMLInputElement;
    inputElement?.focus();
  });
};

/**
 * Open the search modal via keyboard
 *
 * @param   {KeyboardEvent}  event  Keyboard event
 *
 * @return  {void}
 */
const openSearchViaKeyboard = (event: KeyboardEvent): void => {
  // If input or textarea is focused, do nothing
  if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA")
    return;

  if (!(event.key === "/" || event.key === ".")) {
    return;
  }
  event.preventDefault();
  openSearch();
  focusSearch();
};

onMounted(() => {
  window.addEventListener("keydown", (event) => openSearchViaKeyboard(event));
});

onUnmounted(() => {
  window.removeEventListener("keydown", (event) => openSearchViaKeyboard(event));
});
</script>

<style lang="scss">
@use "@styles/components/searchbar.scss";
</style>
