<template>
  <div>
    <h2>Create Comment</h2>
    <input
      v-model="commentForm.author"
      type="text"
      placeholder="Author"
    >
    <input
      v-model="commentForm.email"
      type="email"
      placeholder="Email"
    >
    <textarea
      v-model="commentForm.comment"
      type="text"
    />
    <button
      type="button"
      @click.prevent="create()"
    >
      Submit
    </button>
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