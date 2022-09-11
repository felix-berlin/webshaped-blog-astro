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
        :aria-label="`Besuche mich auf ${index}`"
        class="c-social-list__link"
      >
        <Github
          v-if="index === 'github'"
          :class="`is-${index}`"
        />
        <Facebook
          v-if="index === 'facebook'"
          :class="`is-${index}`"
        />
        <Twitter
          v-if="index === 'twitter'"
          :class="`is-${index}`"
        />
        <Instagram
          v-if="index === 'instagram'"
          :class="`is-${index}`"
        />
        <Youtube
          v-if="index === 'youTube'"
          :class="`is-${index}`"
        />
        <Linkedin
          v-if="index === 'linkedIn'"
          :class="`is-${index}`"
        />
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Github, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-vue-next'

export interface SocialListProps {
  socialItems: {
    facebook: string;
    instagram: string;
    linkedIn: string;
    mySpace: string;
    pinterest: string;
    soundCloud: string;
    twitter: string;
    wikipedia: string;
    youTube: string;
    github: string | null;
  }
}

const props = defineProps<SocialListProps>()
</script>

<style scoped>

</style>
