<template>
  <button
    v-if="showButton"
    class="c-button c-button--outline"
    @click="triggerPwaInstall()"
  >
    <Download v-if="showIcon" width="16" height="16" />
    {{ __(lang?.locale, "install_app.button") }}
  </button>
</template>

<script setup lang="ts">
import {
  installPrompt,
  showInstallButton,
  triggerPwaInstall,
  currentLanguage,
} from "@stores/store";
import { useStore } from "@nanostores/vue";
import { __ } from "@i18n/i18n";
import Download from "virtual:icons/lucide/download";

export interface InstallAppProps {
  showIcon?: boolean;
}

const { showIcon = false } = defineProps<InstallAppProps>();

useStore(installPrompt);
const showButton = useStore(showInstallButton);
const lang = useStore(currentLanguage);
</script>

<style scoped></style>
