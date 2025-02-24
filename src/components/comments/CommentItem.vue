<template>
  <div
    class="c-comment"
    :class="[
      `is-level-${depth} ${isOdd(depth) ? 'is-odd' : 'is-even'}`,
      {
        'has-replies': comment?.replies?.nodes?.length != null && comment.replies.nodes.length > 0,
      },
    ]"
  >
    <article :id="'comment-' + comment.id" class="c-comment__item">
      <header class="c-comment__header">
        <img
          v-if="comment.author?.node?.avatar"
          :src="comment.author.node.avatar.url!"
          :alt="
            t('comment.author.image.alt', {
              author: comment.author.node.name,
            })
          "
          :width="comment.author.node.avatar.width!"
          :height="comment.author.node.avatar.height!"
          class="c-comment__author-image"
        />
        <div v-else class="c-comment__author-icon">
          <User width="86" height="86" />
        </div>

        <div class="c-comment__author-name-wrap">
          <h2 class="c-comment__author-name">
            {{ comment?.author?.node.name }}
          </h2>
          <Verified v-if="isAuthor" width="18" height="18" />
        </div>
      </header>
      <main class="c-comment__content">
        <!-- <a
          v-if="comment.parentId"
          :href="`#comment-${comment.parentId}`"
          class="c-comment__reply-to"
          >Reply to</a
        > -->

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

          <Date :date="comment.dateGmt!" :lang="lang" class="c-comment__date">
            <template #before>
              {{ t("comment.date") }}
            </template>
          </Date>
        </footer>
      </main>
    </article>

    <!-- <Transition name="fade" mode="in-out"> -->
    <div
      v-if="replyToCommentForm"
      v-auto-animate
      class="c-comment is-create-comment"
      :class="`is-level-${depth + 1} ${isOdd(depth) ? 'is-even' : 'is-odd'}`"
    >
      <CreateComment :current-post-id="currentPostId" :reply-to-comment-id="comment?.commentId">
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
    <!-- </Transition> -->

    <template v-if="comment?.replies?.nodes && comment?.replies?.nodes.length > 0">
      <CommentItem
        v-for="reply in comment.replies.nodes"
        :key="reply.id"
        v-auto-animate
        :comment="reply"
        :depth="depth + 1"
        :author-id="authorId"
        :current-post-id="currentPostId"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import Date from "@components/post/Date.vue";
import CreateComment from "@components/comments/CreateComment.vue";
import { computed, ref } from "vue";
import { useTranslations } from "@utils/i18n/utils";
import type { Comment } from "@ts_types/generated/graphql";
import { currentLanguage } from "@stores/store";
import { useStore } from "@nanostores/vue";
import User from "virtual:icons/lucide/user";
import Reply from "virtual:icons/lucide/reply";
import X from "virtual:icons/lucide/x";
import Verified from "virtual:icons/lucide/verified";

interface CommentItemProps {
  comment: Comment;
  depth: number;
  authorId?: string;
  currentPostId: number;
}

const props = defineProps<CommentItemProps>();
const lang = useStore(currentLanguage);
const t = useTranslations(lang.value);
const replyToCommentForm = ref(false);
const isAuthor = computed(() => props?.comment?.author?.node.id === props.authorId);

/**
 * Methods
 */

const isOdd = (num: number) => num % 2;

const toggleReplyCommentForm = () => (replyToCommentForm.value = !replyToCommentForm.value);
</script>

<style lang="scss">
@use "@styles/components/comments/comment";
</style>
