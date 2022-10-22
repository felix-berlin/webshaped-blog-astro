<template>
  <div class="c-author">
    <img
      v-if="author.node.avatar.foundAvatar"
      :src="author.node.avatar.url"
      class="c-author__image"
      :alt="'Foto des Author:' + author.node.firstName + ' ' + author.node.lastName"
    >
    <ScrobbleDisplay />
    <p class="c-author__name">
      {{ author.node.firstName + ' ' + author.node.lastName }}
    </p>
    <p class="c-author__description">
      {{ author.node.description }}
    </p>
    <SocialList :social-items="socials" />
  </div>
</template>

<script setup lang="ts">
import SocialList from '@components/SocialList.vue'
import ScrobbleDisplay from '@components/ScrobbleDisplay.vue'

export interface AuthorData {
  node: {
    avatar: {
      foundAvatar: boolean;
      height?: number | null;
      url?: string | null;
      width?: number | null;
    }
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    description: string | null;
    id: string | null;
    seo: {
      social: {
        facebook: string;
        instagram: string;
        linkedIn: string;
        mySpace: string;
        pinterest: string;
        soundCloud: string;
        twitter: string;
        wikipedia: string;
        youTube: string;
      }
    }
    socialAdvanced: {
      github: string | null;
    }
  }
}

export interface AuthorProps {
  author: AuthorData;
}

const props = defineProps<AuthorProps>()

const socials = {
  facebook: {
    url: props.author.node.seo.social.facebook,
  },
  instagram: {
    url: props.author.node.seo.social.instagram
  },
  linkedIn: {
    url: props.author.node.seo.social.linkedIn
  },
  mySpace: {
    url: props.author.node.seo.social.mySpace
  },
  pinterest: {
    url: props.author.node.seo.social.pinterest
  },
  soundCloud: {
    url: props.author.node.seo.social.soundCloud
  },
  twitter: {
    url: props.author.node.seo.social.twitter
  },
  wikipedia: {
    url: props.author.node.seo.social.wikipedia
  },
  youTube: {
    url: props.author.node.seo.social.youTube
  },
  github: {
    url: props.author.node.socialAdvanced.github,
    rel: 'me'
  },
}

</script>

<style scoped>

</style>
