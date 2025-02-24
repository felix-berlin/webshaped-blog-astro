<template>
  <div class="c-github-stats-card c-post-card" v-if="error">{{ error }}</div>

  <div class="c-github-stats-card c-post-card is-graph" v-if="!error">
    <h2>Folgende Sprachen schreibe ich am meisten:</h2>
    <CodeLangGraph
      class="is-skeleton"
      v-if="loading"
      :languages="skeletonLangDataMock"
      :show-tooltips="false"
    />
    <CodeLangList class="is-skeleton" v-if="loading" :languages="filteredLanguagePercentages" />

    <Transition name="fade" mode="out-in">
      <CodeLangGraph v-if="!loading" :languages="filteredLanguagePercentages" />
    </Transition>
    <Transition name="fade" mode="out-in">
      <CodeLangList v-if="!loading" :languages="filteredLanguagePercentages" />
    </Transition>
    <i
      >Der Sprachgraph bezieht sich auf meine öffentlichen und privaten Repositories (main
      Branch).</i
    >
  </div>

  <section class="o-github-total-lines" v-if="!error">
    <div class="c-github-stats-card c-post-card is-total-lines-1">
      <h2>Gesamtanzahl Codezeilen:</h2>
    </div>
    <div class="c-github-stats-card c-post-card is-total-lines-2">
      {{ loading ? 0 : formattedTotalBytes }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import CodeLangGraph from "./CodeLangGraph.vue";
import CodeLangList from "./CodeLangList.vue";

const loading = ref(true);
const error = ref<string | null>(null);
const languagePercentages = ref<{ [key: string]: number }>({});
const totalBytes = ref(0);

const filteredLanguagePercentages = computed(() => {
  return Object.fromEntries(
    Object.entries(languagePercentages.value).filter(
      ([, percentage]) => percentage.toFixed(2) !== "0.00",
    ),
  );
});

const formattedTotalBytes = computed(() => {
  return totalBytes.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

const skeletonLangDataMock = {
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

onMounted(() => {
  fetch("/api/github/stats")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching data from API: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      languagePercentages.value = data.languagePercentages;
      totalBytes.value = data.totalBytes;
      loading.value = false;
    })
    .catch((err) => {
      error.value = `Error fetching data from API: ${err.message}`;
      loading.value = false;
    });
});
</script>

<style lang="scss">
@use "@styles/components/github-stats";
</style>
