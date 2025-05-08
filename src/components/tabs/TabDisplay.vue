<template>
  <TabsView>
    <TabItem :header="t('comments')">
      <CommentsClient id="comments" :current-post-id="postId" :author-id="authorId" />
    </TabItem>
    <TabItem header="Webmentions">
      <LoadWebmentions />
    </TabItem>
  </TabsView>
</template>

<script setup lang="ts">
import TabsView from "@components/tabs/TabsView.vue";
import TabItem from "@components/tabs/TabItem.vue";
import { useI18n } from "@/composables/useI18n";
import { useStore } from "@nanostores/vue";
import { currentWebmentionsCount, currentLanguage } from "@stores/store";
import type { NodeWithAuthor } from "@/gql/graphql.ts";
import { defineAsyncComponent } from "vue";

const CommentsClient = defineAsyncComponent(
  () => import("@components/comments/CommentsClient.vue"),
);
const LoadWebmentions = defineAsyncComponent(
  () => import("@components/webmentions/LoadWebmentions.vue"),
);

export interface TabDisplayProps {
  postId: string;
  authorId: NodeWithAuthor["authorId"];
}

defineProps<TabDisplayProps>();

const { t } = useI18n();
const WebmentionCount = useStore(currentWebmentionsCount);
</script>
