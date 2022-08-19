<template>
  <div class="c-author">
    <img
      v-if="author.node.avatar.foundAvatar"
      :src="author.node.avatar.url"
      alt="Author"
    >
    <p>{{ author.node.firstName + ' ' + author.node.lastName }}</p>
    <p>{{ author.node.description }}</p>
    <SocialList :social-items="socials" />
  </div>
</template>

<script setup lang="ts">
import SocialList from '@components/SocialList.vue'

export interface AuthorProps {
  author: {
    node: {
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
}

const props = defineProps<AuthorProps>()

const socials = { ...props.author.node.seo.social, ...props.author.node.socialAdvanced }

</script>

<style scoped>

</style>
