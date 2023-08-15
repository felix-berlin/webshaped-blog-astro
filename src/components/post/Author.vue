<template>
  <div class="c-author">
    <img
      v-if="author?.node?.avatar?.url"
      :src="author.node.avatar.url"
      class="c-author__image"
      :alt="`Foto des Author: ${author?.node.firstName} ${author?.node.lastName}`"
      :width="author.node.avatar.width || undefined"
      :height="author.node.avatar.height || undefined"
      loading="lazy"
    />

    <ScrobbleDisplay :scrobble-api="scrobbleApi" :idle-after-count="1" />

    <p class="c-author__name">
      {{ `${author?.node.firstName} ${author?.node.lastName}` }}
    </p>

    <p class="c-author__description">
      {{ author?.node.description }}
    </p>

    <SocialList :social-items="socials" :lang="lang" />
  </div>
</template>

<script setup lang="ts">
import SocialList from "@components/SocialList.vue";
import ScrobbleDisplay from "@components/ScrobbleDisplay.vue";
import type {
  Language,
  NodeWithAuthorToUserConnectionEdge,
  Maybe,
} from "@ts_types/generated/graphql";

export interface AuthorProps {
  author: Maybe<NodeWithAuthorToUserConnectionEdge> | undefined;
  lang: Maybe<Language>;
}

const props = defineProps<AuthorProps>();

const scrobbleApi = import.meta.env.PUBLIC_LAST_FM_SCROBBLER_API;

const socials = {
  facebook: {
    url: props?.author?.node?.seo?.social?.facebook,
  },
  instagram: {
    url: props?.author?.node?.seo?.social?.instagram,
  },
  linkedIn: {
    url: props?.author?.node?.seo?.social?.linkedIn,
  },
  mySpace: {
    url: props?.author?.node?.seo?.social?.mySpace,
  },
  pinterest: {
    url: props?.author?.node?.seo?.social?.pinterest,
  },
  soundCloud: {
    url: props?.author?.node?.seo?.social?.soundCloud,
  },
  twitter: {
    url: props?.author?.node?.seo?.social?.twitter,
  },
  wikipedia: {
    url: props?.author?.node?.seo?.social?.wikipedia,
  },
  youTube: {
    url: props?.author?.node?.seo?.social?.youTube,
  },
  github: {
    url: props?.author?.node?.socialAdvanced?.github,
    rel: "me",
  },
};
</script>

<style scoped></style>
