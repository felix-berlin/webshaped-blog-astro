<template>
  <div class="c-main-nav__button-bar">
    <SearchModal />

    <div class="c-main-nav__buttons">
      <LanguageDropdown />

      <InstallApp :show-icon="true" :show-text="false" :icon-size="24" class="c-button--icon" />

      <a
        class="c-main-nav__rss-link c-button c-button--icon"
        href="/rss.xml"
        :aria-label="t('rss_feed.link_title')"
      >
        <Rss class="c-main-nav__rss-icon" />
      </a>

      <ColorModeToggle class="c-main-nav__color-toggle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Rss from "virtual:icons/lucide/rss";
import { useTranslations } from "@utils/i18n/utils";
import InstallApp from "@components/InstallApp.vue";
import ColorModeToggle from "@components/ColorModeToggle.vue";
import SearchModal from "@components/main-nav/SearchModal.vue";
import LanguageDropdown from "@components/LanguageDropdown.vue";
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";

const lang = useStore(currentLanguage);
const t = useTranslations(lang.value);
</script>
