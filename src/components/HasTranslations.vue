<template>
  <div v-if="translations && translations?.length > 0" class="c-has-translation">
    <p class="c-has-translation__headline">
      {{ __(lang?.locale, "post_also_available_in") }}
    </p>
    <div
      v-for="translation in translations"
      :key="translation?.language?.slug!"
      class="c-has-translation__translations"
    >
      <a
        :href="`/${translation?.language?.slug}/${translation?.slug}`"
        class="c-has-translation__link"
        :aria-label="`Blog in ${translation?.language?.name} lesen`"
      >
        {{ translation?.language?.name }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { __ } from "@utils/i18n/utils";
import type { Post, Language, Maybe } from "@ts_types/generated/graphql";

interface HasTranslationsProps {
  translations: Post["translations"];
  lang: Maybe<Language>;
}

defineProps<HasTranslationsProps>();
</script>
