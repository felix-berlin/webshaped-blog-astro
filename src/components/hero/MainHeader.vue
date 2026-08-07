<template>
  <header id="mainHeader" class="o-header">
    <MainNav :menu-items="menuItems" :lang="lang" />
    <!-- <LanguageSelect class="is-desktop" /> -->
  </header>
</template>

<script setup lang="ts">
// import LanguageSelect from "@components/LanguageSelect.vue";
import MainNav from "@components/hero/MainNav.vue";

import type { GetMenuByIdQuery } from "@/gql/graphql.ts";

export interface HeaderProps {
  lang: null | string | undefined;
  menuItems: NonNullable<GetMenuByIdQuery["menu"]>["menuItems"];
}

const props = defineProps<HeaderProps>();
</script>
