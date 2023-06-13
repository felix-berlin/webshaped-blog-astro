<template>
  <header class="o-header">
    <MainNav :menu-items="props.menuItems" :lang="lang" />
    <!-- <LanguageSelect class="is-desktop" /> -->
  </header>
</template>

<script setup lang="ts">
import LanguageSelect from "@components/LanguageSelect.vue";
import MainNav from "@components/hero/MainNav.vue";
import type { MenuItem } from "../../types/generated/graphql";
import type { Language, Maybe } from "../../types/generated/graphql";

export interface HeaderProps {
  menuItems: {
    nodes: MenuItem[];
  };
  lang: Maybe<Language> | undefined;
}

const props = defineProps<HeaderProps>();
</script>

<style lang="scss"></style>
