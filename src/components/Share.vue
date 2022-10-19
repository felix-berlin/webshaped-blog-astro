<template>
  <button
    type="button"
    class="c-share"
    @click.prevent="startShare(title, text, data.currentUrl)"
  >
    <Share2
      focusable="false"
      aria-label="Blog Post teilen"
      class="c-share__icon"
    />
  </button>
</template>

<script setup lang="ts">
import { Share2 } from 'lucide-vue-next';
import { ref, onMounted, reactive } from 'vue';
import { useShare } from '@vueuse/core'


export interface ShareProps {
  title?: string;
  text?: string;
  url?: string | undefined;
}

const { share, isSupported } = useShare()

const props = defineProps<ShareProps>()

interface Data {
  currentUrl: string | undefined;
}

const data: Data = reactive({
  currentUrl: props.url,
})

const startShare = (title:string, text:string, url:string) => {
  share({title, text, url})
}

// const share = (title:string, text:string, url:string) => {
//   try {
//     navigator.share({title, text, url})
//   } catch (err) {
//     console.log(err)
//   } finally {
//     data.shared = true
//   }
// }

onMounted(() => {
  if (!props.url) {
    data.currentUrl = window.location.href
  }
})
</script>

<style scoped>

</style>
