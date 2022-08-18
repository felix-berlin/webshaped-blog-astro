<template>
  <div class="c-author">
    <img :src="author.avatar.url" v-if="author.avatar.foundAvatar">
    <p>{{ author.firstName + ' ' + author.lastName }}</p>
    <p>{{ author.description }}</p>
    <div>
      <template v-for="(social, index) in socials" :key="index">
        <a :href="social" target="_blank" v-if="social.length > 0 && social !== null">
          <Github v-if="index === 'github'"></Github>
          <Facebook v-if="index === 'facebook'"></Facebook>
          <Twitter v-if="index === 'twitter'"></Twitter>
          <Instagram v-if="index === 'instagram'"></Instagram>
          <Youtube v-if="index === 'youtube'"></Youtube>
        </a>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Github, Facebook, Twitter, Instagram, Youtube } from 'lucide-vue-next'

interface Props {
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

const props = defineProps<Props>()

const socials = { ...props.author.seo.social, ...props.author.socialAdvanced }

</script>

<style scoped>

</style>