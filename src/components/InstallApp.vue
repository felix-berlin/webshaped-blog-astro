<template>
  <button
    v-if="isWebWorkerSupported()"
    class="c-button c-button--outline"
    @click="triggerPWAInstall()"
  >
    Install App
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { isWebWorkerSupported } from "@utils/helpers";

const installPrompt = ref(null);
const showInstallButton = ref(false);

const triggerPWAInstall = async () => {
  if (!installPrompt.value) {
    return;
  }

  const result = await installPrompt.value.prompt();
  console.log(`Install prompt was: ${result.outcome}`);
  disableInAppInstallPrompt();
};

const disableInAppInstallPrompt = () => {
  installPrompt.value = null;
  showInstallButton.value = false;
};

onMounted(() => {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt.value = event;
    showInstallButton.value = true;
  });
});
</script>

<style scoped></style>
