<template>
  <section class="c-comments">
    <div id="createComment" class="c-comment is-create-comment is-level-0 is-even">
      <CreateComment :current-post-id="currentPostId" :lang="lang" @comment-created="getComments" />
    </div>

    <div v-auto-animate class="c-comments__list">
      <template v-if="comments.length">
        <CommentItem
          v-for="comment in comments"
          :key="useFragment(CommentFieldsFragmentDoc, comment.node).id"
          :comment="comment.node"
          :depth="0"
          :author-id="authorId"
          :current-post-id="currentPostId"
          :lang="lang"
        />
      </template>
      <template v-else-if="fetching">
        <CommentItemSkeleton v-for="item in 5" :key="item" />
      </template>
      <NoComments v-else :lang="lang" />
    </div>

    <button
      v-if="pageInfo.hasNextPage"
      class="c-comments__load-more-button c-button c-button--outline"
      @click="getComments()"
    >
      <RefreshCw
        width="20"
        height="20"
        :class="`c-comments__loading-icon${fetching ? ' is-loading' : ''}`"
      />
      <span>{{ t("comments.load_more.button") }}</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import CommentItemSkeleton from "@components/comments/CommentItemSkeleton.vue";
import CreateComment from "@components/comments/CreateComment.vue";
import { useQuery } from "@urql/vue";
import RefreshCw from "virtual:icons/lucide/refresh-cw";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";

import type { GetCommentsByIdQuery, GetCommentsByIdQueryVariables } from "@/gql/graphql.ts";

import { useI18n } from "@/composables/useI18n";
import { useFragment } from "@/gql/fragment-masking";
import { CommentFieldsFragmentDoc, GetCommentsByIdDocument } from "@/gql/graphql.ts";

const CommentItem = defineAsyncComponent(() => import("@components/comments/CommentItem.vue"));
const NoComments = defineAsyncComponent(() => import("@components/comments/NoComments.vue"));

export interface CommentsProps {
  authorId?: string;
  currentPostId: string;
  lang: Lang;
}

type CommentsResult = NonNullable<GetCommentsByIdQuery["comments"]>;

const { authorId, currentPostId, lang } = defineProps<CommentsProps>();
const { t } = useI18n(() => lang);

// Root comments only (the query filters `parent: 0`); replies come nested in each node.
const comments = ref<CommentsResult["edges"]>([]);
const pageInfo = ref<Partial<CommentsResult["pageInfo"]>>({});

const queryVariables = reactive<GetCommentsByIdQueryVariables>({
  after: null,
  contentId: currentPostId,
  first: 5,
});

const { executeQuery, fetching } = useQuery({
  pause: true,
  query: GetCommentsByIdDocument,
  variables: queryVariables,
});

/** Loads the next page of comments and appends it. */
const getComments = async (): Promise<void> => {
  if (pageInfo.value.hasNextPage) queryVariables.after = pageInfo.value.endCursor;

  const { data, error } = await executeQuery({ variables: queryVariables });
  if (error.value) {
    console.error("Error fetching comments:", error.value);
    return;
  }

  comments.value = [...comments.value, ...(data.value?.comments?.edges ?? [])];
  if (data.value?.comments?.pageInfo) pageInfo.value = data.value.comments.pageInfo;
};

onMounted(getComments);
</script>

<style lang="scss">
@use "@styles/components/comments/comments";
@use "@styles/components/comments/comment";
</style>
