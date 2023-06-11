<template>
  <div class="c-language-select">
    <p>{{ currentLanguage.value }}</p>
    <select
      class="c-language-select__select"
      :value="obj.userLanguage"
      aria-label="Select language"
      @blur="changeLanguage($event)"
    >
      <template
        v-for="[code, name] in Object.entries(availableLanguages)"
        :key="code"
      >
        <option :value="code">
          <span>{{ name }}</span>
        </option>
      </template>
    </select>
  </div>
</template>

<script setup lang="ts">
import { availableLanguages } from "@i18n/i18n";
import { onMounted, reactive } from "vue";
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/i18n";

const obj = reactive({
  userLanguage: "",
});

const userLanguage = (): string => {
  const language = navigator.language;
  return language.split("-")[0];
};

const changeLanguage = (event: Event) => {
  const newLang = (event.target as HTMLSelectElement).value;
  console.log(newLang);
  const [_leadingSlash, _oldLang, ...rest] =
    window.location.pathname.split("/");
  const slug = rest.join("/");
  // window.location.pathname = `/${newLang}/${slug}`;
  currentLanguage.set(newLang);
};

onMounted(() => {
  if (obj.userLanguage.length < 0) obj.userLanguage = userLanguage();
  currentLanguage.set(userLanguage());
  console.log(userLanguage());
  // console.log(Astro.params);

  // console.log(useStore(currentLanguage));
});
</script>

<style lang="scss">
@use "@styles/components/language-select";
</style>
