<template>
  <div class="c-social-list">
    <template
      v-for="(social, index) in socialItems"
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
        <Linkedin v-if="index === 'linkedIn'" />
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Github, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-vue-next'

export interface SocialListProps {
  socialItems: object
}

const props = defineProps<SocialListProps>()
</script>

<style scoped>

</style>
