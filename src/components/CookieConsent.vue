<template>
  <div class="c-cookie-consent">
    <slot name="text">
      <Cookie />
      Cookie Consent
      <p>{{ data.acceptAllCookies }}</p>
    </slot>
    <div>
      <button type="button" @click="data.acceptAllCookies = false">
        Reject all
      </button>
      <button type="button" @click="data.acceptAllCookies = true">
        Accept all
      </button>
      <button type="button" @click="showOptions">Options</button>
    </div>
    <div v-if="data.showOptions">Options</div>
    <Matomo
      v-if="data.isMounted && data.acceptAllCookies"
      site-id="3"
      cookie-domain="*.webshaped.de"
      host="analytics.webshaped.de"
      :debug-mode="true"
      :require-consent="false"
    />
  </div>
</template>

<script setup lang="ts">
import { Cookie } from "lucide-vue-next";
import {
  reactive,
  watchEffect,
  onBeforeUnmount,
  onBeforeMount,
  onMounted,
} from "vue";
import Matomo from "@components/Matomo.vue";

const data = reactive({
  showOptions: false,
  acceptAllCookies: localStorage.getItem("acceptAllCookies")
    ? localStorage.getItem("acceptAllCookies")
    : false,
  isMounted: false,
});

const stop = watchEffect(() => {
  if (data.acceptAllCookies !== null)
    localStorage.setItem("acceptAllCookies", data.acceptAllCookies.toString());
});

const cookieChoice = (choice: boolean) => {
  localStorage.setItem("acceptAllCookies", choice.toString());
};

const showOptions = () => {
  data.showOptions = !data.showOptions;
  console.log("show options");
};

// onBeforeMount(() => {
//   const acceptAllCookies = localStorage.getItem('acceptAllCookies');
//   console.log(acceptAllCookies);

//   if (acceptAllCookies) {
//     data.acceptAllCookies = localStorage.getItem('acceptAllCookies');
//   }
// });
//
onMounted(() => {
  data.isMounted = true;
  console.log("mounted", data.isMounted && data.acceptAllCookies);
});

onBeforeUnmount(() => {
  stop();
});
</script>

<style lang="scss">
@use "@styles/components/cookie-consent";
</style>
