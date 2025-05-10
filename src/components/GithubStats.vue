<template>
  <div v-if="error" class="c-github-stats-card c-post-card">{{ error }}</div>

  <div v-if="!error" class="c-github-stats-card c-post-card is-graph">
    <h2>{{ t("github_stats.lang_graph.headline") }}</h2>
    <CodeLangGraph
      v-if="loading"
      class="is-skeleton"
      :languages="skeletonLangDataMock"
      :show-tooltips="false"
    />
    <CodeLangList v-if="loading" class="is-skeleton" :languages="filteredLanguagePercentages" />

    <Transition name="fade" mode="out-in">
      <CodeLangGraph v-if="!loading" :languages="filteredLanguagePercentages" />
    </Transition>
    <Transition name="fade" mode="out-in">
      <CodeLangList v-if="!loading" :languages="filteredLanguagePercentages" />
    </Transition>
    <i>{{ t("github_stats.lang_graph.hint") }}</i>
  </div>

  <!-- <section class="o-github-total-lines" v-if="!error">
    <div class="c-github-stats-card c-post-card is-total-lines-1">
      <h2>{{ t("github_stats.total_lines.headline") }}</h2>
    </div>
    <div class="c-github-stats-card c-post-card is-total-lines-2">
      {{ loading ? 0 : formatLargeNumber(totalAdditions) }}
    </div>
  </section> -->
  <section v-if="!error" class="o-github-most-starred">
    <h2>{{ t("github_stats.most_starred.headline", { count: mostStarredRepos.length }) }}</h2>
    <div class="o-github-most-starred__list">
      <a
        v-for="repo in mostStarredRepos"
        :key="repo.name"
        :href="repo.url"
        target="_blank"
        class="c-post-card o-github-most-starred__item"
      >
        <h3 class="o-github-most-starred__title">{{ repo.name }}</h3>
        <p class="o-github-most-starred__description">{{ repo.description }}</p>
        <div
          class="o-github-most-starred__lang"
          :class="`is-${repo.mostUsedLanguage.toLowerCase()}`"
        >
          {{ repo.mostUsedLanguage }}
        </div>
        <div class="o-github-most-starred__stars">
          <StarIcon width="16" height="16" /><span>{{ repo.stars }}</span>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import CodeLangGraph from "./CodeLangGraph.vue";
import CodeLangList from "./CodeLangList.vue";
import { useI18n } from "@/composables/useI18n";
import StarIcon from "virtual:icons/lucide/star";

const loading = ref(true);
const error = ref<string | null>(null);
const languagePercentages = ref<{ language: string; percentage: number }[]>([]);
const totalBytes = ref(0);
const totalCommits = ref(0);
const mostStarredRepos = ref([]);
const { t } = useI18n();

const filteredLanguagePercentages = computed(() => {
  return Object.fromEntries(
    languagePercentages.value
      .filter(({ percentage }) => percentage.toFixed(2) !== "0.00")
      .map(({ language, percentage }) => [language, percentage]),
  );
});

const formatLargeNumber = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

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
      totalCommits.value = data.totalCommits;
      mostStarredRepos.value = data.mostStarredRepos;
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
