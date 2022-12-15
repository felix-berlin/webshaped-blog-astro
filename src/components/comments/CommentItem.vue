<template>
  <div
    class="c-comment"
    :class="[
      `is-level-${depth} ${isOdd(depth) ? 'is-odd': 'is-even'}`,
      {
      'is-reply': !comment?.replies?.nodes?.length,
      }]"
    role="comment"
  >
    <article
      :id="'comment-' + comment.id"
      class="c-comment__item"
    >
      <header class="c-comment__header">
        <img
          v-if="comment.author?.node?.avatar"
          :src="comment.author.node.avatar.url"
          :alt="__(lang.locale, 'comment.author.image.alt', { author: comment.author.node.name })"
          :width="comment.author.node.avatar.width"
          :height="comment.author.node.avatar.height"
          class="c-comment__author-image"
        >
        <div v-else class="c-comment__author-icon">
          <User :size="86"/>
        </div>

        <div class="c-comment__author-name-wrap">
          <h2 class="c-comment__author-name">{{ comment.author.node.name }}</h2>
          <Verified v-if="isAuthor" :size="18"></Verified>
        </div>
      </header>
      <main class="c-comment__content">
        <a v-if="comment.parentId" :href="`#comment-${comment.parentId}`" class="c-comment__reply-to">Reply to</a>

        <p class="c-comment__text" v-html="comment.content"></p>

        <footer class="c-comment__footer">
          <button type="button"
                  class="c-comment__reply-button c-button c-button--icon"
                  v-if="depth < 5"
                  @click="toggleReplyCommentForm()">
            <Reply :size="18"/> {{ __(lang.locale, 'comment.reply_button') }}
          </button>

          <Date :date="comment.dateGmt" class="c-comment__date">
            <template #before>
              {{ __(lang.locale, 'comment.date') }}
            </template>
          </Date>

        </footer>
      </main>
    </article>

    <Transition name="fade" mode="in-out">
      <div class="c-comment is-create-comment" :class="`is-level-${depth + 1} ${isOdd(depth) ? 'is-even': 'is-odd'}`" v-if="replyToCommentForm">
        <CreateComment  :current-post-id="currentPostId" :lang="lang" :reply-to-comment-id="comment.commentId" >
          <template #beforeContent>
            <button type="button" @click="toggleReplyCommentForm()"><X/></button>
          </template>
        </CreateComment>
      </div>
    </Transition>


    <template
      v-if="comment.replies"
      v-for="(reply, index) in comment.replies.nodes"
      :key="index"
    >
      <CommentItem :comment="reply" :depth="depth + 1" :author-id="authorId" :lang="lang" :current-post-id="currentPostId" />
    </template>

  </div>
</template>

<script setup lang="ts">
import Date from '@components/Date.vue';
import CreateComment from '@components/comments/CreateComment.vue';
import { computed, ref } from 'vue';
import { __ } from '@i18n/i18n';
import { User, Reply, X, Verified } from 'lucide-vue-next';

export interface CommentData {
  content: string;
  dateGmt: string;
  id: string;
  parentId?: string | null;
  commentId: number;
  author: {
    node: {
      name: string;
      id: string;
      avatar?: {
        url?: string;
        width?: number;
        height?: number;
      }
    }
  }
  replies?: {
    nodes: [];
  }
}

interface CommentItemProps {
  comment: CommentData;
  depth: number;
  authorId?: string;
  lang: {
    locale: string;
  },
  currentPostId: number
}

const props = defineProps<CommentItemProps>()

const replyToCommentForm = ref(false);

const isAuthor = computed(() => props.comment.author.node.id === props.authorId);

/**
 * Methods
 */

const isOdd = (num: number) => num % 2;

const toggleReplyCommentForm = () => replyToCommentForm.value = !replyToCommentForm.value;
</script>

<style lang="scss">
@use '@styles/components/comment';
</style>
