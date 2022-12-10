<template>
  <section class="c-comments">
    <h2>{{ __(lang.locale, 'comments.headline') }}</h2>

    <p v-if="!comments.nodes?.length">{{ __(lang.locale, 'comments.no_comments') }}</p>

    <CreateComment :current-post-id="currentPostId" />
    <template
      v-for="comment in comments.nodes"
      :key="comment.id"
    >
      <CommentItem :comment="comment" :depth="0" :author-id="authorId" />
    </template>
  </section>
</template>

<script setup lang="ts">
// import { onMounted } from 'vue';
import CommentItem from '@components/comments/CommentItem.vue';
import type { CommentData } from '@components/comments/CommentItem.vue';
import CreateComment from '@components/comments/CreateComment.vue';
import { __ } from '@i18n/i18n'

export interface CommentsProps {
  comments: {
    nodes?: [
      CommentData
    ]
  },
  currentPostId: number;
  id?: string;
  authorId: string;
  lang: {
    locale: string;
  }
}

const props = defineProps<CommentsProps>()

// const flatListToHierarchical = (
//     data = [],
//     {idKey='key',parentKey='parentId',childrenKey='children'} = {}
// ) => {
//     const tree = [];
//     const childrenOf = {};
//     data.forEach((item) => {
//         const newItem = {...item};
//         const { [idKey]: id, [parentKey]: parentId = 0 } = newItem;
//         childrenOf[id] = childrenOf[id] || [];
//         newItem[childrenKey] = childrenOf[id];
//         parentId
//             ? (
//                 childrenOf[parentId] = childrenOf[parentId] || []
//             ).push(newItem)
//             : tree.push(newItem);
//     });
//     return tree;
// };
</script>

<style lang="scss">
@use '@styles/components/comments';
</style>
