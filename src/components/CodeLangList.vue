<template>
  <ul class="c-code-lang-list">
    <li
      v-for="(percentage, language) in languages"
      :key="language"
      class="c-code-lang-list__item"
      :class="`is-${language.toLowerCase()}`"
    >
      {{ language }} {{ percentage.toFixed(2) }}%
    </li>
  </ul>
</template>

<script setup lang="ts">
const { languages } = defineProps<{
  /** Percentage per language name. */
  languages: Record<string, number>;
}>();
</script>
