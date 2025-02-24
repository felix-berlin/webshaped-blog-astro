<template>
  <button
    class="c-install-button c-button"
    :class="cssClass"
    @click="triggerPwaInstall()"
    v-tooltip="{ content: t("install_app.not_ready.tooltip"), disabled: installReady }"
  >
    <Download v-if="showIcon" :width="iconSize" :height="iconSize" />
    <template v-if="showText">
      {{ t("install_app.button") }}
    </template>
  </button>
</template>

<script setup lang="ts">
import {
  installPrompt,
  pwaReadyToInstall,
  triggerPwaInstall,
  currentLanguage,
} from "@stores/store";
import { useStore } from "@nanostores/vue";
import { useTranslations } from "@utils/i18n/utils";
import Download from "virtual:icons/lucide/download";

export interface InstallAppProps {
  showIcon?: boolean;
  showText?: boolean;
  iconSize?: number;
  cssClass?: object | string | Array<string>;
}

const {
  showIcon = false,
  showText = true,
  iconSize = 16,
  cssClass = "",
} = defineProps<InstallAppProps>();

useStore(installPrompt);
const installReady = useStore(pwaReadyToInstall);
const lang = useStore(currentLanguage);
const t = useTranslations(lang.value);
</script>

<style scoped></style>
