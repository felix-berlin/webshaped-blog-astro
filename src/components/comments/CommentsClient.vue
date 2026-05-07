<template>
  <section class="c-comments">
    <div id="createComment" class="c-comment is-create-comment is-level-0 is-even">
      <CreateComment :current-post-id="currentPostId" @comment-created="getComments" />
    </div>

    <NoComments v-if="!hasComments" />

    <div v-auto-animate class="c-comments__list">
      <template v-if="hasComments">
        <CommentItem
          v-for="comment in cleanComments"
          :key="comment.node.id"
          :comment="comment.node"
          :depth="0"
          :author-id="authorId!"
          :current-post-id="currentPostId"
        />
      </template>
      <template v-if="!comments.fetching">
        <CommentItemSkeleton v-for="item in 5" :key="item" />
      </template>
    </div>

    <button
      v-if="data?.pageInfo?.hasNextPage"
      class="c-comments__load-more-button c-button c-button--outline"
      @click="getComments()"
    >
      <RefreshCw
        width="20"
        height="20"
        :class="['c-comments__loading-icon', { 'is-loading': comments.fetching.value }]"
      />
      <span>{{ t("comments.load_more.button") }}</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import CommentItemSkeleton from "@components/comments/CommentItemSkeleton.vue";
import CreateComment from "@components/comments/CreateComment.vue";
import { useQuery } from "@urql/vue";
import RefreshCw from "virtual:icons/lucide/refresh-cw";
import { computed, defineAsyncComponent, reactive } from "vue";

import type { NodeWithAuthor, Post } from "@/gql/graphql.ts";
import type {
  RootQueryToCommentConnectionEdge,
  RootQueryToCommentConnectionPageInfo,
} from "@/gql/graphql.ts";

import { useI18n } from "@/composables/useI18n";
import { GetCommentsByIdDocument } from "@/gql/graphql.ts";
import { paginatedFlatListToHierarchical } from "@/utils/helpers.ts";

const CommentItem = defineAsyncComponent(() => import("@components/comments/CommentItem.vue"));
const NoComments = defineAsyncComponent(() => import("@components/comments/NoComments.vue"));

export interface CommentsProps {
  authorId: NodeWithAuthor["authorId"];
  currentPostId: Post["id"];
  id: NodeWithAuthor["id"];
}

interface CommentsData {
  comments: [] | Array<RootQueryToCommentConnectionEdge>;
  pageInfo: RootQueryToCommentConnectionPageInfo;
  partLoading: boolean;
}

const props = defineProps<CommentsProps>();

const data = reactive<CommentsData>({
  comments: [],
  pageInfo: {},
  partLoading: false,
});

const queryVariables = reactive({
  after: null, // Startcursor (für Pagination)
  contentId: props.currentPostId,
  first: 5, // Anzahl der Kommentare pro Seite
});

const comments = useQuery({
  pause: true,
  query: GetCommentsByIdDocument,
  variables: queryVariables,
});

const commentsCount = computed(() => {
  return data.comments.length;
});

const hasComments = computed(() => {
  return !!commentsCount.value;
});

const cleanComments = computed(() => {
  return data.comments.filter((comment) => comment.node.parentId === null);
});

/**
 * TODO: Remove replies from GetCommentsById and use this function
 * This change need adjustments in CommentItem.vue
 *
 * @return  {[type]}  [return description]
 */
const hierarchicalComments = computed(() => {
  return paginatedFlatListToHierarchical(data.comments, {
    childrenKey: "children",
    idKey: "id",
    parentKey: "parentId", // or "parentDatabaseId" if needed
  });
});

const { t } = useI18n();

/**
 * Get comments by post id
 *
 * @param currentPostId
 * @param first
 * @param after
 */
const getComments = () => {
  if (data.pageInfo.hasNextPage) {
    queryVariables.after = data.pageInfo.endCursor;
  }

  comments.executeQuery({ variables: queryVariables }).then((response) => {
    const { error } = response;
    if (error.value) {
      console.error("Error fetching comments:", error.value);
      return;
    }

    const newEdges = response.data.value?.comments?.edges || [];
    const pageInfo = response.data.value?.comments?.pageInfo;

    if (newEdges.length) {
      // Append new comments to the existing list
      data.comments = [...data.comments, ...newEdges];
    }

    data.pageInfo = pageInfo;
  });
};

getComments();
</script>

<style lang="scss">
@use "@styles/components/comments/comments";
@use "@styles/components/comments/comment";
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
