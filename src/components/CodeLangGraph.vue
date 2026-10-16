<template>
  <ul class="c-code-lang-graph">
    <li
      v-for="(percentage, language) in languages"
      :key="language"
      v-tooltip="{
        content: `${language} ${percentage.toFixed(2)}%`,
        placement: 'top',
        disabled: !showTooltips,
      }"
      class="c-code-lang-graph__item"
      :class="`is-${language.toLowerCase()}`"
      :style="{ '--lang-percentage': percentage.toFixed(2) + '%' }"
    />
  </ul>
</template>

<script setup lang="ts">
const { languages, showTooltips = true } = defineProps<{
  /** Percentage per language name. */
  languages: Record<string, number>;
  showTooltips?: boolean;
}>();
</script>
