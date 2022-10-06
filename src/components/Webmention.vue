<template>
  <div>
    My Webmention's
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const getWebmentions = async () => {
  const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${window.location.href}`)
  const data = await response.json()
  console.log(data);

  return data.children
}

onMounted(() => {
  getWebmentions();
});
</script>

<style scoped>

</style>
