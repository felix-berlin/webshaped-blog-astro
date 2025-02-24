<template>
  <TabsView>
    <TabItem :header="__(lang?.locale!, 'comments')">
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
import CommentsClient from "@components/comments/CommentsClient.vue";
import LoadWebmentions from "@components/webmentions/LoadWebmentions.vue";
import { __ } from "@utils/i18n/utils";
import { useStore } from "@nanostores/vue";
import { currentWebmentionsCount, currentLanguage } from "@stores/store";
import type { NodeWithAuthor } from "@ts_types/generated/graphql";

export interface TabDisplayProps {
  postId: number;
  authorId: NodeWithAuthor["authorId"];
}

defineProps<TabDisplayProps>();

const lang = useStore(currentLanguage);
const WebmentionCount = useStore(currentWebmentionsCount);
</script>
