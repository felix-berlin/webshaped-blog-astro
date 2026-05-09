import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
  onOfflineReady() {
    console.log("PWA application ready to work offline");
  },
  onRegisteredSW(swScriptUrl) {
    console.log("SW registered: ", swScriptUrl);
  },
});
