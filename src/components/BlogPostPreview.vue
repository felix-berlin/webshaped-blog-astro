<template>
  <article v-for="(post, index) in cards" :key="index" class="c-post-card">
    <a class="c-post-card__link" :href="postPathBuilder(post.slug, post.language?.slug ?? lang)">
      <h2 class="c-post-card__title">{{ post.title }}</h2>

      <div class="c-post-card__excerpt" v-html="post.excerpt" />

      <div class="c-post-card__read-more">
        <span>{{ t("blog.read_more") }}</span>
        <ArrowRight width="22" height="22" class="c-post-card__read-more-arrow" />
      </div>
    </a>
  </article>
</template>

<script setup lang="ts">
import type { Lang } from "@utils/i18n/ui";

import { PostCardFields } from "@services/queries/getPostPreview";
import { postPathBuilder } from "@utils/i18n/utils";
import ArrowRight from "virtual:icons/lucide/arrow-right";
import { computed } from "vue";

import { useI18n } from "@/composables/useI18n";
import { type FragmentType, useFragment } from "@/gql";

export interface BlogPostPreviewProps {
  lang: Lang;
  posts: FragmentType<typeof PostCardFields>[];
}

const { lang, posts } = defineProps<BlogPostPreviewProps>();
const { t } = useI18n(() => lang);

const cards = computed(() => useFragment(PostCardFields, posts));
</script>

<style lang="scss">
@use "@styles/components/post-card";
</style>
