<template>
  <div>
    <h2>Comments</h2>
    <template v-for="(comment, index) in comments.nodes" :key="comment.id">
      <CommentItem :comment="comment"></CommentItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive , onMounted } from 'vue';
import CommentItem from '../components/CommentItem.vue';

const props = defineProps ({
  comments: {
    type: Object,
    default: () => {},
  },
})

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