<template>
  <article class="c-comment__item">
    <header class="c-comment__header">
      <div class="c-comment__author-image"/>

      <div class="c-comment__author-name-wrap">
        <h2 class="c-comment__author-name" />
      </div>
    </header>
    <main class="c-comment__content">

      <p class="c-comment__text"/>

      <!-- <footer class="c-comment__footer">
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

      </footer> -->
    </main>
  </article>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
@use '@styles/components/comment-item-skeleton.scss';
</style>
