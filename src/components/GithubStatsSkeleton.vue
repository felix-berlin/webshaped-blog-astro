<template>
  <CodeLangGraph
    class="is-skeleton"
    :languages="filteredLanguagePercentages"
    :show-tooltips="false"
  />
</template>

<script setup lang="ts">
import CodeLangGraph from "./CodeLangGraph.vue";

const filteredLanguagePercentages = {
  CSS: 38.02660312272305,
  PHP: 26.015819330171375,
  JavaScript: 12.950763290567174,
  SCSS: 6.007951636810379,
  TypeScript: 2.4874462437779257,
  Astro: 1.3031886346985595,
  Vue: 0.7794710680480621,
  HTML: 11.144375113868353,
  Python: 0.04880883844321259,
  Dart: 0.04141031945695539,
  Blade: 0.30380711613215317,
  Shell: 0.034887325301050216,
  PowerShell: 0.023458718736913076,
  Less: 0.33225833142076827,
  Sass: 0.47375250075956793,
  Pug: 0.01238433214230767,
  Ruby: 0.009824591607767014,
};
</script>

<style lang="scss">
.c-language-list.is-skeleton {
  .c-language-list__item {
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
    border: 1px solid #000;
  }
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
</style>
