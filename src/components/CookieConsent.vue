<template>
  <div class="c-cookie-consent">
    <slot name="text">
      <Cookie />
      Cookie Consent
      <p>{{ data.cookieConsent }}</p>
    </slot>
    <div>
      <button
        type="button"
        @click="data.cookieConsent = false"
      >
        Reject all
      </button>
      <button
        type="button"
        @click="data.cookieConsent = true"
      >
        Accept all
      </button>
      <button
        type="button"
        @click="showOptions"
      >
        Options
      </button>
    </div>
    <div v-if="data.showOptions">
      Options
    </div>
    <Matomo
      v-if="data.showOptions"
      site-id="3"
      cookie-domain="*.webshaped.de"
      host="analytics.webshaped.de"
      :debug-mode="true"
    />
  </div>
</template>

<script setup lang="ts">
import { Cookie } from 'lucide-vue-next';
import { reactive, watchEffect, onBeforeUnmount, onBeforeMount, onMounted } from 'vue';
import Matomo from '@components/Matomo.vue';

const data = reactive({
  showOptions: false,
  cookieConsent: localStorage.getItem('cookieConsent') ? localStorage.getItem('cookieConsent') : false,
  isMounted: false,
});



const stop = watchEffect(() => {
  if (data.cookieConsent !== null) localStorage.setItem('cookieConsent', data.cookieConsent.toString())
})

const cookieChoice = (choice: boolean) => {
  localStorage.setItem('cookieConsent', choice.toString());
};

const showOptions = () => {
  data.showOptions = !data.showOptions;
  console.log('show options');
};

// onBeforeMount(() => {
//   const cookieConsent = localStorage.getItem('cookieConsent');
//   console.log(cookieConsent);

//   if (cookieConsent) {
//     data.cookieConsent = localStorage.getItem('cookieConsent');
//   }
// });
//
onMounted(() => {
  data.isMounted = true;
  console.log('mounted');
});

onBeforeUnmount(() => {
  stop();
});

</script>

<style lang="scss">
@use '@styles/components/cookie-consent';
</style>
