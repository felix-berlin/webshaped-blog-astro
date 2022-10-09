<template>
  <div class="c-webmentions-count">
    <AtSign
      aria-label="Webmentions Anzahl"
      class="c-webmentions-count__icon"
    />
    <p class="c-webmentions-count__count">
      {{ count }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { currentWebmentionsCount } from '@stores/store';
import { AtSign } from 'lucide-vue-next'

const count = useStore(currentWebmentionsCount)

</script>

<style scoped>

</style>
