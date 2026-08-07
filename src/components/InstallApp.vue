<template>
  <button
    v-tooltip="{ content: t('install_app.not_ready.tooltip'), disabled: installReady }"
    class="c-install-button c-button"
    :class="cssClass"
    @click="triggerPwaInstall()"
  >
    <Download v-if="showIcon" :width="iconSize" :height="iconSize" />
    <template v-if="showText">
      {{ t("install_app.button") }}
    </template>
  </button>
</template>

<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { installPrompt, pwaReadyToInstall } from "@stores/store";
import Download from "virtual:icons/lucide/download";

import { useI18n } from "@/composables/useI18n";

export interface InstallAppProps {
  cssClass?: Array<string> | object | string;
  iconSize?: number;
  showIcon?: boolean;
  showText?: boolean;
}

const {
  cssClass = "",
  iconSize = 16,
  showIcon = false,
  showText = true,
} = defineProps<InstallAppProps>();

const prompt = useStore(installPrompt);
const installReady = useStore(pwaReadyToInstall);
const { t } = useI18n();

/**
 * Triggers the PWA install prompt and resets the stored prompt state once it has been shown.
 *
 * @return  {Promise<void>}
 */
const triggerPwaInstall = async (): Promise<void> => {
  const event = prompt.value;
  if (!event) return;

  await event.prompt();
  installPrompt.set(null);
  pwaReadyToInstall.set(false);
};
</script>

<style scoped></style>
