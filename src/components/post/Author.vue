<template>
  <div class="c-author">
    <div class="c-author__image-wrap">
      <img
        v-if="author?.node?.avatar?.url"
        :src="author.node.avatar.url"
        class="c-author__image"
        :alt="`Foto des Author: ${author?.node.firstName} ${author?.node.lastName}`"
        :width="author.node.avatar.width || undefined"
        :height="author.node.avatar.height || undefined"
        loading="lazy"
      />

      <ScrobbleDisplay
        :scrobble-api="scrobbleApi"
        :idle-after-count="1"
        class="c-author__scrobble"
      />
    </div>

    <p class="c-author__name">
      {{ `${author?.node.firstName} ${author?.node.lastName}` }}
    </p>

    <p class="c-author__description">
      {{ author?.node.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import ScrobbleDisplay from "@components/ScrobbleDisplay.vue";
import type {
  Language,
  NodeWithAuthorToUserConnectionEdge,
  Maybe,
} from "@ts_types/generated/graphql";
import { LAST_FM_SCROBBLER_API } from "astro:env/client";

export interface AuthorProps {
  author: Maybe<NodeWithAuthorToUserConnectionEdge> | undefined;
  lang: Maybe<Language>;
}

defineProps<AuthorProps>();

const scrobbleApi = LAST_FM_SCROBBLER_API;
</script>

<style lang="scss">
@use "@styles/components/_author";
</style>
