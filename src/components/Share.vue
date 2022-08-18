<template>
  <button
    type="button"
    @click.prevent="share(title, text, data.currentUrl)"
  >
    <Share2 />
  </button>
</template>

<script setup lang="ts">
import { Share2 } from 'lucide-vue-next';
import { ref, onMounted, reactive } from 'vue';

interface Props {
  title: string;
  text: string;
  url?: string;
}

const props = defineProps<Props>()

interface Data {
  shared: boolean;
  currentUrl: string;
}

const data: Data = reactive({
  shared: false,
  currentUrl: props.url,
})

const share = (title:string, text:string, url:string) => {
  try {
    navigator.share({title, text, url})
  } catch (err) {
    console.log(err)
  } finally {
    data.shared = true
  }
}

onMounted(() => {
  if (!props.url) {
    data.currentUrl = window.location.href
  }
})
</script>

<style scoped>

</style>