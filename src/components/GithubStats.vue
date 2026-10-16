<template>
  <div v-if="error" class="c-github-stats-card c-post-card">
    {{ error }}
  </div>

  <template v-else>
    <div class="c-github-stats-card c-post-card is-graph">
      <h2>{{ t("github_stats.lang_graph.headline") }}</h2>
      <Transition name="fade" mode="out-in">
        <CodeLangGraph
          :key="String(loading)"
          :class="{ 'is-skeleton': loading }"
          :languages="loading ? skeletonLangDataMock : filteredLanguagePercentages"
          :show-tooltips="!loading"
        />
      </Transition>
      <Transition name="fade" mode="out-in">
        <CodeLangList
          :key="String(loading)"
          :class="{ 'is-skeleton': loading }"
          :languages="filteredLanguagePercentages"
        />
      </Transition>
      <i>{{ t("github_stats.lang_graph.hint") }}</i>
    </div>

    <section class="o-github-most-starred">
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
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import StarIcon from "virtual:icons/lucide/star";
import { computed, onMounted, ref } from "vue";

import type { GithubStats } from "@/pages/api/github/stats";

import { useI18n } from "@/composables/useI18n";

import CodeLangGraph from "./CodeLangGraph.vue";
import CodeLangList from "./CodeLangList.vue";

const { lang } = defineProps<{ lang: Lang }>();
const { t } = useI18n(() => lang);

const loading = ref(true);
const error = ref<null | string>(null);
const languagePercentages = ref<GithubStats["languagePercentages"]>([]);
const mostStarredRepos = ref<GithubStats["mostStarredRepos"]>([]);

const filteredLanguagePercentages = computed(() => {
  return Object.fromEntries(
    languagePercentages.value
      .filter(({ percentage }) => percentage.toFixed(2) !== "0.00")
      .map(({ language, percentage }) => [language, percentage]),
  );
});

const skeletonLangDataMock = {
  Astro: 1.3031886346985595,
  Blade: 0.30380711613215317,
  CSS: 38.02660312272305,
  Dart: 0.04141031945695539,
  HTML: 11.144375113868353,
  JavaScript: 12.950763290567174,
  Less: 0.33225833142076827,
  PHP: 26.015819330171375,
  PowerShell: 0.023458718736913076,
  Pug: 0.01238433214230767,
  Python: 0.04880883844321259,
  Ruby: 0.009824591607767014,
  Sass: 0.47375250075956793,
  SCSS: 6.007951636810379,
  Shell: 0.034887325301050216,
  TypeScript: 2.4874462437779257,
  Vue: 0.7794710680480621,
};

onMounted(async () => {
  try {
    const response = await fetch("/api/github/stats");
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(`HTTP ${response.status}: ${body.error ?? "no details"}`);
    }

    const stats: GithubStats = await response.json();
    languagePercentages.value = stats.languagePercentages;
    mostStarredRepos.value = stats.mostStarredRepos;
  } catch (err) {
    // Visitors get a translated notice; the details go to the console.
    console.error("Fetching /api/github/stats failed:", err);
    error.value = t.value("github_stats.error");
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss">
@use "@styles/components/github-stats";
</style>
