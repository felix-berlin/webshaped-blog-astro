<template>
  <TabsView>
    <TabItem :header="t('comments')">
      <CommentsClient
        id="comments"
        :current-post-id="postId"
        :author-id="authorId"
      />
    </TabItem>
    <TabItem header="Webmentions">
      <LoadWebmentions />
    </TabItem>
  </TabsView>
</template>

<script setup lang="ts">
import TabItem from "@components/tabs/TabItem.vue";
import TabsView from "@components/tabs/TabsView.vue";
import { useStore } from "@nanostores/vue";
import { currentLanguage, currentWebmentionsCount } from "@stores/store";
import { defineAsyncComponent } from "vue";

import type { NodeWithAuthor } from "@/gql/graphql.ts";

import { useI18n } from "@/composables/useI18n";

const CommentsClient = defineAsyncComponent(
  () => import("@components/comments/CommentsClient.vue"),
);
const LoadWebmentions = defineAsyncComponent(
  () => import("@components/webmentions/LoadWebmentions.vue"),
);

export interface TabDisplayProps {
  authorId: NodeWithAuthor["authorId"];
  postId: string;
}

defineProps<TabDisplayProps>();

const { t } = useI18n();
const WebmentionCount = useStore(currentWebmentionsCount);
</script>
