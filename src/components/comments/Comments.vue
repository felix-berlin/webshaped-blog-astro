<template>
  <section class="c-comments">
    <h2>{{ __(lang.locale, 'comments.headline') }}</h2>

    <p v-if="!data.comments?.length">{{ __(lang.locale, 'comments.no_comments') }}</p>
    <CreateComment :current-post-id="currentPostId" :lang="lang" />

    <template
      v-for="comment in data.comments"
      :key="comment.id"
    >
      <CommentItem :comment="comment.node" :depth="0" :author-id="authorId" :lang="lang" :current-post-id="currentPostId" />
    </template>

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

interface CommentsData {
  comments: Object[],
  pageInfo: {
    hasNextPage?: boolean,
    endCursor?: string
  }
}

const props = defineProps<CommentsProps>()

const data = reactive<CommentsData>({
  comments: [],
  pageInfo: {},
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
      }
    );
}

onMounted(async() => {
  await getComments();
});
</script>

<style lang="scss">
@use '@styles/components/comments';
</style>
