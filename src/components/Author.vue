<template>
  <div class="c-author">
    <img
      v-if="author.avatar.foundAvatar"
      :src="author.avatar.url"
    >
    <p>{{ author.firstName + ' ' + author.lastName }}</p>
    <p>{{ author.description }}</p>
    <SocialList :social-items="socials" />
  </div>
</template>

<script setup lang="ts">
import SocialList from '@components/SocialList.vue'

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
