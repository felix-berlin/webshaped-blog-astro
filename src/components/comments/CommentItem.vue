<template>
  <div
    class="c-comment"
    :class="[`is-level-${depth}`, parityClass(depth), { 'has-replies': replies.length }]"
  >
    <article :id="'comment-' + comment.id" class="c-comment__item">
      <header class="c-comment__header">
        <img
          v-if="comment.author?.node?.avatar"
          :src="comment.author.node.avatar.url!"
          :alt="
            t('comment.author.image.alt', {
              author: comment.author.node.name ?? '',
            })
          "
          :width="comment.author.node.avatar.width!"
          :height="comment.author.node.avatar.height!"
          loading="lazy"
          decoding="async"
          class="c-comment__author-image"
        />
        <div v-else class="c-comment__author-icon">
          <User width="86" height="86" />
        </div>

        <div class="c-comment__author-name-wrap">
          <h2 class="c-comment__author-name">
            {{ comment.author?.node.name }}
          </h2>
          <Verified v-if="isAuthor" width="18" height="18" />
        </div>
      </header>
      <main class="c-comment__content">
        <div class="c-comment__text" v-html="comment.content" />

        <footer class="c-comment__footer">
          <button
            v-if="depth < 5"
            type="button"
            class="c-comment__reply-button c-button c-button--icon"
            @click="toggleReplyCommentForm()"
          >
            <span class="c-comment__reply-button-icon"><Reply width="16" height="16" /> </span>
            <span class="c-comment__reply-button-text">{{ t("comment.reply_button") }}</span>
          </button>

          <Date :date="toIsoUtc(comment.dateGmt)!" :lang="lang" class="c-comment__date">
            <template #before>
              {{ t("comment.date") }}
            </template>
          </Date>
        </footer>
      </main>
    </article>

    <div
      v-if="replyToCommentForm"
      v-auto-animate
      class="c-comment is-create-comment"
      :class="[`is-level-${depth + 1}`, parityClass(depth + 1)]"
    >
      <CreateComment
        :current-post-id="currentPostId"
        :reply-to-comment-id="comment.id"
        :lang="lang"
      >
        <template #beforeContent>
          <button
            type="button"
            class="c-comment__close c-button c-button--icon c-button--close"
            @click="toggleReplyCommentForm()"
          >
            <X />
          </button>
        </template>
      </CreateComment>
    </div>

    <CommentItem
      v-for="reply in replies"
      :key="useFragment(CommentFieldsFragmentDoc, reply).id"
      :comment="reply"
      :depth="depth + 1"
      :author-id="authorId"
      :current-post-id="currentPostId"
      :lang="lang"
    />
  </div>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import CreateComment from "@components/comments/CreateComment.vue";
import Date from "@components/post/Date.vue";
import { toIsoUtc } from "@utils/helpers";
import Reply from "virtual:icons/lucide/reply";
import User from "virtual:icons/lucide/user";
import Verified from "virtual:icons/lucide/verified";
import X from "virtual:icons/lucide/x";
import { computed, ref } from "vue";

import { useI18n } from "@/composables/useI18n";
import { type FragmentType, useFragment } from "@/gql/fragment-masking";
import { CommentFieldsFragmentDoc } from "@/gql/graphql.ts";

/**
 * A comment node as returned by GetCommentsById: the fields spread via the
 * CommentFields fragment (masked) plus the sibling `replies` field, which
 * recurses to the same shape.
 */
export type CommentNode = FragmentType<typeof CommentFieldsFragmentDoc> & {
  replies?: null | { nodes?: Array<CommentNode> | null };
};

interface CommentItemProps {
  authorId?: string;
  comment: CommentNode;
  currentPostId: string;
  depth: number;
  lang: Lang;
}

const props = defineProps<CommentItemProps>();
const { t } = useI18n(() => props.lang);
const comment = computed(() => useFragment(CommentFieldsFragmentDoc, props.comment));
const replies = computed(() => props.comment.replies?.nodes ?? []);
const replyToCommentForm = ref(false);
const isAuthor = computed(() => comment.value.author?.node.id === props.authorId);

const parityClass = (depth: number) => (depth % 2 ? "is-odd" : "is-even");

const toggleReplyCommentForm = () => (replyToCommentForm.value = !replyToCommentForm.value);
</script>
