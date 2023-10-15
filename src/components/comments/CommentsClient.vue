<template>
  <section class="c-comments">
    <div
      id="createComment"
      class="c-comment is-create-comment is-level-0 is-even"
    >
      <CreateComment
        :current-post-id="currentPostId"
        @comment-created="reloadComments"
      />
    </div>

    <NoComments v-if="!data.hasComments" />

    <div v-auto-animate class="c-comments__list">
      <template v-if="data.hasComments">
        <CommentItem
          v-for="comment in data.comments"
          :key="comment.node.id"
          :comment="comment.node"
          :depth="0"
          :author-id="authorId!"
          :current-post-id="currentPostId"
        />
      </template>
      <template v-if="!data.hasLoaded">
        <CommentItemSkeleton v-for="item in 5" :key="item" />
      </template>
    </div>

    <button
      v-if="data?.pageInfo?.hasNextPage"
      class="c-comments__load-more-button c-button c-button--outline"
      @click="
        getComments(props.currentPostId, 5, data.pageInfo.endCursor);
        data.partLoading = true;
      "
    >
      <RefreshCw
        width="20"
        height="20"
        :class="[
          'c-comments__loading-icon',
          { 'is-loading': data.partLoading },
        ]"
      />
      <span>{{ __(lang?.locale!, "comments.load_more.button") }}</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import CommentItem from "@components/comments/CommentItem.vue";
import CommentItemSkeleton from "@components/comments/CommentItemSkeleton.vue";
import type { NodeWithAuthor, Post } from "@ts_types/generated/graphql";
import CreateComment from "@components/comments/CreateComment.vue";
import { __ } from "@i18n/i18n";
import { getCommentsById } from "@services/api";
import RefreshCw from "virtual:icons/lucide/refresh-cw";
import { currentLanguage } from "@stores/store";
import { useStore } from "@nanostores/vue";
import type { RootQueryToCommentConnectionEdge } from "@ts_types/generated/graphql";
import NoComments from "@components/comments/NoComments.vue";

export interface CommentsProps {
  currentPostId: Post["postId"];
  id: NodeWithAuthor["id"];
  authorId: NodeWithAuthor["authorId"];
}

interface CommentsData {
  comments: RootQueryToCommentConnectionEdge[];
  pageInfo: {
    hasNextPage?: boolean;
    endCursor?: string;
  };
  loading: boolean;
  hasLoaded: boolean;
  partLoading: boolean;
  hasComments: boolean;
  commentsCount: number;
}

const props = defineProps<CommentsProps>();

const emit = defineEmits(["comments-count"]);

const data = reactive<CommentsData>({
  comments: [],
  pageInfo: {},
  loading: false,
  hasLoaded: false,
  partLoading: false,
  hasComments: true,
  commentsCount: 0,
});

const lang = useStore(currentLanguage);

/**
 * Get comments by post id
 *
 * @param currentPostId
 * @param first
 * @param after
 */
const getComments = async (
  currentPostId = props.currentPostId,
  first = 5,
  after?: string,
) => {
  data.loading = true;

  await getCommentsById(currentPostId, first, after).then((response) => {
    // Because the API returns all comments, we need to filter out all child comments

    data.comments = [
      ...data.comments,
      ...response.edges.filter(
        (comment: RootQueryToCommentConnectionEdge) =>
          comment.node.parentId === null,
      ),
    ];
    data.pageInfo = response.pageInfo as {
      hasNextPage?: boolean;
      endCursor?: string;
    };

    data.loading = false;
    data.hasLoaded = true;
    data.hasComments = !!data.comments?.length;
    data.commentsCount = data.comments.length;

    emit("comments-count", data.commentsCount);

    if (after) {
      data.partLoading = false;
    }
  });
};

const reloadComments = () => {
  data.comments = [];
  data.pageInfo = {};
  data.loading = false;
  getComments();
};

onMounted(async () => {
  await getComments();

  // const test = data.comments.find((comment) => comment.node.parentId === null);

  // console.log(test);
});
</script>

<style lang="scss">
@use "@styles/components/comments/comments";

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
