<template>
  <div class="c-green-hosted">
    <a
      class="c-green-hosted__link"
      href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fwebshaped.de"
    >
      <Leaf width="16" height="16" />
      <span v-html="t('green_hosted')" />
    </a>
  </div>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import Leaf from "virtual:icons/lucide/leaf";

import { useI18n } from "@/composables/useI18n";

interface GreenHostedProps {
  lang: Lang;
}

const { lang } = defineProps<GreenHostedProps>();

const { t } = useI18n(() => lang);
</script>
