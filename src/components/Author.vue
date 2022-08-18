<template>
  <div class="c-author">
    <img
      v-if="author.avatar.foundAvatar"
      :src="author.avatar.url"
    >
    <p>{{ author.firstName + ' ' + author.lastName }}</p>
    <p>{{ author.description }}</p>
    <div>
      <template
        v-for="(social, index) in socials"
        :key="index"
      >
        <a
          v-if="social.length > 0 && social !== null"
          :href="social"
          target="_blank"
          :title="`Besuche mich auf ${index}`"
        >
          <Github v-if="index === 'github'" />
          <Facebook v-if="index === 'facebook'" />
          <Twitter v-if="index === 'twitter'" />
          <Instagram v-if="index === 'instagram'" />
          <Youtube v-if="index === 'youTube'" />
        </a>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Github, Facebook, Twitter, Instagram, Youtube } from 'lucide-vue-next'

export interface AuthorProps {
  author: {
    avatar: {
      foundAvatar: boolean;
      height: number | null;
      url: string | null;
      width: number | null;
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

const props = defineProps<AuthorProps>()

const socials = { ...props.author.seo.social, ...props.author.socialAdvanced }

</script>

<style scoped>

</style>