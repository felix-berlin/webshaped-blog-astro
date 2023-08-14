<template>
  <TabsView>
    <TabItem :header="__(lang?.locale!, 'comments')">
      <CommentsClient
        id="comments"
        :current-post-id="postId"
        :lang="lang!"
        author-id="{author?.node.id}"
      />
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
import { __ } from "@i18n/i18n";
import type { Maybe, Language } from "@ts_types/generated/graphql";

export interface TabDisplayProps {
  postId: number;
  lang: Maybe<Language>;
}

defineProps<TabDisplayProps>();
</script>
