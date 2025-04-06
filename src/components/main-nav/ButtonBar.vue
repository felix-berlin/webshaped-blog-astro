<template>
  <div class="c-main-nav__button-bar">
    <SearchModal />

    <div class="c-main-nav__buttons">
      <LanguageDropdown />

      <!-- FIXME: PWA is not working (manifest is not found ect.) -->
      <!-- <InstallApp :show-icon="true" :show-text="false" :icon-size="24" class="c-button--icon" /> -->

      <RssLink class="c-main-nav__rss-link" />

      <!-- TODO: Enable after lightmode is final: #9 -->
      <!-- <ColorModeToggle class="c-main-nav__color-toggle" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// import InstallApp from "@components/InstallApp.vue";
// import ColorModeToggle from "@components/ColorModeToggle.vue";
import SearchModal from "@components/main-nav/SearchModal.vue";
import LanguageDropdown from "@components/LanguageDropdown.vue";
import RssLink from "@components/RssLink.vue";
</script>
