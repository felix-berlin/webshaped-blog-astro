<template>
  <a
    class="c-button c-button--icon"
    :href="`/${lang}/rss.xml`"
    target="_blank"
    :aria-label="t('rss_feed.link_title')"
  >
    <slot>
      <Rss class="c-main-nav__rss-icon" />
    </slot>
  </a>
</template>

<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";
import Rss from "virtual:icons/lucide/rss";

import { useI18n } from "@/composables/useI18n";

const lang = useStore(currentLanguage);
const { t } = useI18n();
</script>
