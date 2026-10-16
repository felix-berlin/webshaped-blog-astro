<template>
  <Transition name="fade" mode="in-out">
    <Suspense>
      <Webmentions :lang="lang" />

      <template #fallback>
        <div class="c-webmentions">
          <WebmentionSkeleton v-for="item in 6" :key="item" />
        </div>
      </template>
    </Suspense>
  </Transition>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import Webmentions from "@components/webmentions/Webmentions.vue";
import WebmentionSkeleton from "@components/webmentions/WebmentionSkeleton.vue";

defineProps<{ lang: Lang }>();
</script>
