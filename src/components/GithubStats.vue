<template>
  <div class="c-github-stats-card c-post-card" v-if="error">{{ error }}</div>

  <div class="c-github-stats-card c-post-card is-graph" v-if="!error">
    <h2>Folgende Sprachen schreibe ich am meisten:</h2>
    <GithubStatsSkeleton v-if="loading" />

    <Transition name="fade" mode="out-in">
      <CodeLangGraph v-if="!loading" :languages="filteredLanguagePercentages" />
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
  </section class="c-github-stats">
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import GithubStatsSkeleton from "./GithubStatsSkeleton.vue";
import CodeLangGraph from "./CodeLangGraph.vue";

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
/// https://github.com/ozh/github-colors
$langs: (
  css: #663399,
  php: #4f5d95,
  javascript: #f1e05a,
  html: #e34c26,
  scss: #c6538c,
  sass: #a53b70,
  typescript: #3178c6,
  astro: #ff5a03,
  vue: #41b883,
  python: #3572a5,
  dart: #00b4ab,
  blade: #f7523f,
  shell: #89e051,
  powershell: #012456,
  less: #1d365d,
  pug: #a86454,
  ruby: #701516,
);

.c-language-list {
  display: flex;
  list-style-type: none;
  padding: 0;
}

.c-language-list__item {
  flex-basis: var(--lang-percentage);
  height: 20px;
}

.o-github-total-lines {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;

  .c-github-stats-card {

    &:first-child {
      flex: 0 1 content;
    }
    &:last-child {
      flex: 1 0;
      font-size: 1.5rem;
    }
  }

}

.github-stats-card {
}

@each $lang, $color in $langs {
  .is-#{$lang} {
    background-color: $color;
  }
}
</style>
