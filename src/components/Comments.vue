<template>
  <div>
    <h2>Comments</h2>
    <CreateComment :current-post-id="currentPostId" />
    <template
      v-for="comment in comments.nodes"
      :key="comment.id"
    >
      <CommentItem :comment="comment" />
    </template>
  </div>
</template>

<script setup lang="ts">
// import { onMounted } from 'vue';
import CommentItem from '@components/CommentItem.vue';
import type { CommentData } from '@components/CommentItem.vue';
import CreateComment from '@components/CreateComment.vue';

export interface CommentsProps {
  comments: {
    nodes?: [
      CommentData
    ]
  },
  currentPostId: number;
  id?: string;
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

<style scoped>

</style>
