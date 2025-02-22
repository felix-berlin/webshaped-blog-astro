<template>
  <div>
    <h1>GitHub Profile Information</h1>
    <div v-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <h2>Languages Used</h2>
        <ul>
          <li v-for="(percentage, language) in languagePercentages" :key="language">
            {{ language }}: {{ percentage.toFixed(2) }}%
          </li>
        </ul>
        <h2>Total Lines of Code: {{ totalBytes }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const loading = ref(true);
const error = ref<string | null>(null);
const languagePercentages = ref<{ [key: string]: number }>({});
const totalBytes = ref(0);

onMounted(() => {
  fetch("/api/github/stats")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching data from API: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      languagePercentages.value = data.languagePercentages;
      totalBytes.value = data.totalBytes;
      loading.value = false;
    })
    .catch((err) => {
      error.value = `Error fetching data from API: ${err.message}`;
      loading.value = false;
    });
});
</script>

<style scoped>
h1,
h2 {
  font-family: Arial, sans-serif;
}
</style>
