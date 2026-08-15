<template>
  <header id="mainHeader" class="o-header">
    <MainNav :menu-items="menuItems" :lang="lang" :translations-routes="translationsRoutes" />
    <!-- <LanguageSelect class="is-desktop" /> -->
  </header>
</template>

<script setup lang="ts">
// import LanguageSelect from "@components/LanguageSelect.vue";
import MainNav from "@components/hero/MainNav.vue";

import type { GetMenuByIdQuery } from "@/gql/graphql.ts";
import type { TranslationRoutes } from "@/types/i18n";

export interface HeaderProps {
  lang: "de" | "en";
  menuItems: NonNullable<GetMenuByIdQuery["menu"]>["menuItems"];
  translationsRoutes: TranslationRoutes;
}

const props = defineProps<HeaderProps>();
</script>
