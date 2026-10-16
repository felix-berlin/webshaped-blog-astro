<template>
  <div v-if="translations?.length" class="c-has-translation">
    <p class="c-has-translation__headline">
      {{ t("post_also_available_in") }}
    </p>
    <div
      v-for="translation in translations"
      :key="translation?.language?.slug ?? translation?.slug ?? ''"
      class="c-has-translation__translations"
    >
      <a
        :href="postPathBuilder(translation?.slug, translation?.language?.slug ?? lang)"
        class="c-has-translation__link"
        :aria-label="t('blog.read_in_lang', { lang: translation?.language?.name ?? '' })"
      >
        {{ translation?.language?.name }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Lang } from "@utils/i18n/ui";

import { postPathBuilder } from "@utils/i18n/utils";

import type { GetAllPostsQuery } from "@/gql/graphql.ts";

import { useI18n } from "@/composables/useI18n";

interface HasTranslationsProps {
  lang: Lang;
  translations: PostNode["translations"];
}

type PostNode = NonNullable<GetAllPostsQuery["posts"]>["nodes"][number];

const { lang, translations } = defineProps<HasTranslationsProps>();
const { t } = useI18n(() => lang);
</script>
