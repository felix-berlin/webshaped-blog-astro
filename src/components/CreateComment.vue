<template>
  <div>
      <h2>Create Comment</h2>
      <input type="text" v-model="commentForm.author" placeholder="Author"/>
      <textarea type="text" v-model="commentForm.comment"/>
      <button type="button" @click.prevent="create()">Submit</button>
  </div>
</template>

<script setup lang="ts">
import { createComment } from '../lib/api'
import { ref, onMounted, reactive } from 'vue';
import { useStore } from '@nanostores/vue';
import { loadingState } from '../../store/store'

const props = defineProps ({
  currentPostId: {
    type: Number,
    default: undefined,
  },
})

const user = useStore(loadingState)

const commentForm = reactive({
  comment: '',
  author: '',
})

async function create() {
  return await createComment(767, commentForm.comment, commentForm.author)
  .then(({res}) => console.log(res)
  ).then(data => console.log(data)).catch(err => console.log(err))
};


onMounted(() => {
  // createComment(767, 'Test Kommentar', 'Felix Test');
  // console.log(create());

})
</script>

<style scoped>

</style>