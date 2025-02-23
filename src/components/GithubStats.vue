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

.c-code-lang-graph {
  display: flex;
  list-style-type: none;
  padding: 0;
}

.c-code-lang-graph__item {
  flex-basis: var(--lang-percentage);
  height: 20px;

  @each $lang, $color in $langs {
    &.is-#{$lang} {
      background-color: $color;
    }
  }
}

.c-code-lang-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.35rem;
  padding-inline-start: 1rem;

  &__item {
    @each $lang, $color in $langs {
      &.is-#{$lang}::marker {
        color: $color;
      }
    }
  }
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

.c-code-lang-graph.is-skeleton,
.c-code-lang-list.is-skeleton {
  .c-code-lang-graph__item,
  .c-code-lang-list__item {
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
  }

  .c-code-lang-graph__item {
    border: 1px solid #000;
  }

  .c-code-lang-list__item {
    color: transparent;
    width: 85%;
  }
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
</style>
