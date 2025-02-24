<template>
  <div class="c-no-mentions">
    <div class="c-no-mentions__text-wrap">
      <p class="c-no-mentions__text is-one" v-html="t('webmentions.no_webmentions')" />
      <p class="c-no-mentions__text is-two" v-html="t('webmentions.your_chance')" />
      <Share class="c-no-mentions__share-button c-button c-button--primary">
        <span class="c-no-mentions__share-button-text">{{ t("share_this_post") }}</span>
      </Share>
    </div>
    <Heart width="250" height="250" stroke-width="1" class="c-no-mentions__icon is-one" />
    <ThumbsUp width="250" height="250" stroke-width="1" class="c-no-mentions__icon is-two" />
  </div>
</template>

<script setup lang="ts">
import { useTranslations } from "@utils/i18n/utils";
import Share from "@components/Share.vue";
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";
import Heart from "virtual:icons/lucide/heart";
import ThumbsUp from "virtual:icons/lucide/thumbs-up";

const lang = useStore(currentLanguage);
const t = useTranslations(lang.value);
</script>

<style lang="scss">
@use "@styles/components/webmentions/no-mentions.scss";
</style>
