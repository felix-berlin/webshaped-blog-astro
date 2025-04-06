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
import Leaf from "virtual:icons/lucide/leaf";
import { useTranslations } from "@utils/i18n/utils";

interface GreenHostedProps {
  lang: string;
}

const { lang } = defineProps<GreenHostedProps>();

const t = useTranslations(lang);
</script>

<style lang="scss">
@use "@styles/components/green-hosted";
</style>
