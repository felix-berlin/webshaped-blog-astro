<template>
  <div class="c-no-mentions">
    <div class="c-no-mentions__text-wrap">
      <p
        class="c-no-mentions__text is-one"
        v-html="__(currentLang?.locale, 'webmentions.no_webmentions')"
      />
      <p
        class="c-no-mentions__text is-two"
        v-html="__(currentLang?.locale, 'webmentions.your_chance')"
      />
      <Share class="c-no-mentions__share-button c-button c-button--primary">
        <span class="c-no-mentions__share-button-text">{{
          __(currentLang?.locale, "share_this_post")
        }}</span>
      </Share>
    </div>
    <Heart width="250" height="250" stroke-width="1" class="c-no-mentions__icon is-one" />
    <ThumbsUp width="250" height="250" stroke-width="1" class="c-no-mentions__icon is-two" />
  </div>
</template>

<script setup lang="ts">
import { __ } from "@utils/i18n/utils";
import Share from "@components/Share.vue";
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";
import Heart from "virtual:icons/lucide/heart";
import ThumbsUp from "virtual:icons/lucide/thumbs-up";
const currentLang = useStore(currentLanguage);
</script>

<style lang="scss">
@use "@styles/components/webmentions/no-mentions.scss";
</style>
