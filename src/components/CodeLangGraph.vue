<template>
  <ul class="c-language-list">
    <li
      v-for="(percentage, language) in languages"
      :key="language"
      class="c-language-list__item"
      :class="`is-${language.toLowerCase()}`"
      :style="{ '--lang-percentage': percentage.toFixed(2) + '%' }"
      v-tooltip="{
        content: `${language} ${percentage.toFixed(2)}%`,
        placement: 'top',
        disabled: !showTooltips,
      }"
    ></li>
  </ul>
</template>

<script setup lang="ts">
interface LanguagesProps {
  [key: string]: number;
}

const { languages, showTooltips = true } = defineProps<{
  languages: LanguagesProps;
  showTooltips?: boolean;
}>();
</script>
