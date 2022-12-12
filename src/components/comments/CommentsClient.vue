<template>
  <section class="c-comments">
    <h2>{{ __(lang.locale, 'comments.headline') }}</h2>

    <CreateComment :current-post-id="currentPostId" :lang="lang" @comment-created="reloadComments" />
    <p v-if="!data.comments?.length">{{ __(lang.locale, 'comments.no_comments') }}</p>

    <TransitionGroup name="list">
      <template
        v-show="data.loaded"
        v-for="comment in data.comments"
        :key="comment"
      >
        <CommentItem :comment="comment.node" :depth="0" :author-id="authorId" :lang="lang" :current-post-id="currentPostId" />
      </template>
    </TransitionGroup>

    <button v-if="data?.pageInfo?.hasNextPage" @click="getComments(props.currentPostId, 5, data.pageInfo.endCursor)"><RefreshCw/> {{ __(lang.locale, 'comments.load_more.button') }}</button>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import CommentItem from '@components/comments/CommentItem.vue';
import type { CommentData } from '@components/comments/CommentItem.vue';
import CreateComment from '@components/comments/CreateComment.vue';
import { __ } from '@i18n/i18n';
import { getCommentsById } from '@lib/api';
import { RefreshCw } from 'lucide-vue-next';

export interface CommentsProps {
  currentPostId: number;
  id?: string;
  authorId: string;
  lang: {
    locale: string;
  }
}

interface CommentsData {
  comments: Object[],
  pageInfo: {
    hasNextPage?: boolean,
    endCursor?: string
  },
  loaded: boolean,
}

const props = defineProps<CommentsProps>()

const data = reactive<CommentsData>({
  comments: [],
  pageInfo: {},
  loaded: false,
})

const getComments = async (
    currentPostId = props.currentPostId,
    first = 5,
    after?:string
  ):Promise<object | any> => {
  await getCommentsById(currentPostId, first, after)
    .then(
      response => {
        data.comments = [...data.comments, ...response.data.comments.edges];
        data.pageInfo = response.data.comments.pageInfo;
        data.loaded = true;
      }
    );
}

const reloadComments = () => {
  data.comments = [];
  data.pageInfo = {};
  data.loaded = false;
  getComments();
}

onMounted(async() => {
  await getComments();
});
</script>

<style lang="scss">
@use '@styles/components/comments';
</style>
