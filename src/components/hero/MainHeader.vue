<template>
  <header id="mainHeader" class="o-header">
    <MainNav :menu-items="menuItems" :lang="lang" />
    <!-- <LanguageSelect class="is-desktop" /> -->
  </header>
</template>

<script setup lang="ts">
// import LanguageSelect from "@components/LanguageSelect.vue";
import MainNav from "@components/hero/MainNav.vue";
import type { Language, MenuToMenuItemConnection, Maybe } from "@ts_types/generated/graphql";

export interface HeaderProps {
  menuItems: MenuToMenuItemConnection;
  lang: Maybe<Language>;
}

const props = defineProps<HeaderProps>();
</script>
