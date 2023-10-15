<template>
  <Transition name="fade" mode="in-out">
    <Suspense>
      <Webmentions
        :current-url="false"
        target="https://develop.webshaped-blog-astro.pages.dev/de/matomo-tracking-script-optimal-einbinden/"
      />

      <template #fallback>
        <div class="c-webmentions">
          <WebmentionSkeleton v-for="item in 6" :key="item" />
        </div>
      </template>
    </Suspense>
  </Transition>
</template>

<script setup lang="ts">
import Webmentions from "@components/webmentions/Webmentions.vue";
import WebmentionSkeleton from "@components/webmentions/WebmentionSkeleton.vue";
</script>
