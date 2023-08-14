<template>
  <TabsView>
    <TabItem :header="__(lang?.locale!, 'comments')">
      <CommentsClient
        id="comments"
        :current-post-id="postId"
        author-id="{author?.node.id}"
      />
    </TabItem>
    <TabItem header="Webmentions" :badge="WebmentionCount">
      <LoadWebmentions />
    </TabItem>
  </TabsView>
</template>

<script setup lang="ts">
import TabsView from "@components/tabs/TabsView.vue";
import TabItem from "@components/tabs/TabItem.vue";
import CommentsClient from "@components/comments/CommentsClient.vue";
import LoadWebmentions from "@components/webmentions/LoadWebmentions.vue";
import { __ } from "@i18n/i18n";
import { useStore } from "@nanostores/vue";
import { currentWebmentionsCount, currentLanguage } from "@stores/store";

export interface TabDisplayProps {
  postId: number;
}

defineProps<TabDisplayProps>();

const lang = useStore(currentLanguage);
const WebmentionCount = useStore(currentWebmentionsCount);
</script>
