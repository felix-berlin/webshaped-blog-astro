<template>
  <div>
      <h2>Create Comment</h2>
      <input type="text" v-model="commentForm.author" placeholder="Author"/>
      <input type="email" v-model="commentForm.email" placeholder="Email"/>
      <textarea type="text" v-model="commentForm.comment"/>
      <button type="button" @click.prevent="create()">Submit</button>
  </div>
</template>

<script setup lang="ts">
import { createComment } from '../lib/api'
import { ref, onMounted, reactive } from 'vue';
import { useStore } from '@nanostores/vue';
import { loadingState } from '../../store/store'

interface Props {
  currentPostId: number;
}

const props = defineProps<Props>()

const user = useStore(loadingState)

interface CommentForm {
  comment: string;
  author: string;
  email?: string;
}

const commentForm: CommentForm = reactive({
  comment: '',
  author: '',
  email: '',
})

async function create() {
  return await createComment(props.currentPostId, commentForm.comment, commentForm.author, commentForm.email)
  .then(({res}) => console.log(res))
  .then(data => console.log(data)).catch(err => console.log(err))
};


onMounted(() => {
  // createComment(767, 'Test Kommentar', 'Felix Test');
  // console.log(create());

})
</script>

<style scoped>

</style>