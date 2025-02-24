<template>
  <div class="c-language-select">
    <select
      class="c-language-select__select"
      v-model="selected"
      aria-label="Select language"
      @change="changeLanguage"
    >
      <template v-for="[code, name] in Object.entries(languages)" :key="code">
        <option :value="code">
          {{ name }}
        </option>
      </template>
    </select>
  </div>
</template>

<script setup lang="ts">
import { languages } from "@utils/i18n/ui";
import { useTranslatedPath, getRouteFromUrl } from "@utils/i18n/utils";
import { onMounted, ref } from "vue";
import { useVModel } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";

const selected = useVModel(currentLanguage);
const currentUrl = ref();
const translatePath = ref();
const route = ref();

const changeLanguage = (event: Event) => {
  window.location.href = translatePath.value(`/${route.value ? route.value : ""}`, selected.value);
};

onMounted(() => {
  currentUrl.value = new URL(window.location.href);
  route.value = getRouteFromUrl(currentUrl.value);
  translatePath.value = useTranslatedPath(selected.value);
});
</script>

<style lang="scss">
@use "@styles/components/language-select";
</style>
