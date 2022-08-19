<template>
  <div>
    <h2>Comments</h2>
    <CreateComment :current-post-id="currentPostId" />
    <template
      v-for="(comment, index) in comments.nodes"
      :key="comment.id"
    >
      <CommentItem :comment="comment" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive , onMounted } from 'vue';
import CommentItem from '@components/CommentItem.vue';
import CreateComment from '@components/CreateComment.vue';

export interface CommentsProps {
  comments: {
    nodes: [
      {
        content: string;
        dateGmt: string;
        id: string;
        parentId: string;
        commentId: string;
        author: {
          node: {
            name: string;
            id: string;
            avatar: {
              url?: string;
              width?: number;
              height?: number;
            };
          }
        }
        replies: {
          nodes: [];
        }
      }
    ]
  },
  currentPostId: number;
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


onMounted(() => {
})
</script>

<style scoped>

</style>
