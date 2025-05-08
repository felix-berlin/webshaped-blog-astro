<template>
  <div v-if="translations && translations?.length > 0" class="c-has-translation">
    <p class="c-has-translation__headline">
      {{ t("post_also_available_in") }}
    </p>
    <div
      v-for="translation in translations"
      :key="translation?.language?.slug!"
      class="c-has-translation__translations"
    >
      <a
        :href="`/${translation?.language?.slug}/posts/${translation?.slug}`"
        class="c-has-translation__link"
        :aria-label="t('blog.read_in_lang', { lang: translation?.language?.name })"
      >
        {{ translation?.language?.name }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTranslations } from "@utils/i18n/utils";
import type { Post } from "@/gql/graphql.ts";

interface HasTranslationsProps {
  translations: Post["translations"];
  lang: string;
}

const { translations, lang } = defineProps<HasTranslationsProps>();
const t = useTranslations(lang);
</script>
