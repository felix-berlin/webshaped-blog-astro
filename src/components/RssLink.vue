<template>
  <a
    class="c-button c-button--icon"
    :href="rssPathBuilder(lang)"
    target="_blank"
    :aria-label="t('rss_feed.link_title')"
  >
    <slot>
      <Rss class="c-main-nav__rss-icon" />
    </slot>
  </a>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import { rssPathBuilder } from "@utils/i18n/utils";
import Rss from "virtual:icons/lucide/rss";

import { useI18n } from "@/composables/useI18n";

const { lang } = defineProps<{ lang: Lang }>();
const { t } = useI18n(() => lang);
</script>
