<template>
  <section class="c-comments">
    <h2>{{ __(lang.locale, 'comments.headline') }}</h2>

    <CreateComment :current-post-id="currentPostId" :lang="lang" @comment-created="reloadComments" />

    <p v-if="!data.hasComments">{{ __(lang.locale, 'comments.no_comments') }}</p>

    <!-- <TransitionGroup name="list"> -->
      <template v-for="item in 5" :key="item">
        <CommentItemSkeleton v-if="!data.hasLoaded"/>
      </template>
    <!-- </TransitionGroup> -->

    <TransitionGroup name="list">
      <template
        v-for="comment in data.comments"
        :key="comment"
      >
        <CommentItem v-show="data.hasComments" :comment="comment.node" :depth="0" :author-id="authorId" :lang="lang" :current-post-id="currentPostId" />
      </template>
    </TransitionGroup>
    <button v-if="data?.pageInfo?.hasNextPage"
            @click="getComments(props.currentPostId, 5, data.pageInfo.endCursor); data.partLoading = true;"
            class="c-comments__load-more-button c-button c-button--outline">
            <RefreshCw :size="20" :class="[ 'c-comments__loading-icon', { 'is-loading': data.partLoading }]"/> <span>{{ __(lang.locale, 'comments.load_more.button') }}</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import CommentItem from '@components/comments/CommentItem.vue';
import CommentItemSkeleton from '@components/comments/CommentItemSkeleton.vue';
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
  loading: boolean,
  hasLoaded: boolean,
  partLoading: boolean,
  hasComments: boolean,
}

const props = defineProps<CommentsProps>()

const data = reactive<CommentsData>({
  comments: [],
  pageInfo: {},
  loading: false,
  hasLoaded: false,
  partLoading: false,
  hasComments: true,
})

const getComments = async (
    currentPostId = props.currentPostId,
    first = 5,
    after?:string,
  ):Promise<object | any> => {
 data.loading = true;

  await getCommentsById(currentPostId, first, after)
    .then(
      response => {
        data.comments = [...data.comments, ...response.data.comments.edges];
        data.pageInfo = response.data.comments.pageInfo;
        data.loading = false;
        data.hasLoaded = true;
        data.hasComments = !!data.comments?.length;

        if (after) {
          data.partLoading = false;
        }
      }
    );
}

const reloadComments = () => {
  data.comments = [];
  data.pageInfo = {};
  data.loading = false;
  getComments();
}

onMounted(async() => {
  await getComments();
});
</script>

<style lang="scss">
@use '@styles/components/comments';

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
