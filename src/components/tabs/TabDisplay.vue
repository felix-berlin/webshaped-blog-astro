<template>
  <TabsView>
    <TabItem :header="t('comments')">
      <CommentsClient id="comments" :current-post-id="postId" :author-id="authorId" :lang="lang" />
    </TabItem>
    <TabItem header="Webmentions">
      <LoadWebmentions :lang="lang" />
    </TabItem>
  </TabsView>
</template>

<script setup lang="ts">
import TabItem from "@components/tabs/TabItem.vue";
import TabsView from "@components/tabs/TabsView.vue";
import { useStore } from "@nanostores/vue";
import { currentWebmentionsCount } from "@stores/store";
import { defineAsyncComponent } from "vue";

import { useI18n } from "@/composables/useI18n";

const CommentsClient = defineAsyncComponent(
  () => import("@components/comments/CommentsClient.vue"),
);
const LoadWebmentions = defineAsyncComponent(
  () => import("@components/webmentions/LoadWebmentions.vue"),
);

export interface TabDisplayProps {
  authorId: string | undefined;
  lang: "de" | "en";
  postId: string;
}

const props = defineProps<TabDisplayProps>();

const { t } = useI18n(() => props.lang);
const WebmentionCount = useStore(currentWebmentionsCount);
</script>
