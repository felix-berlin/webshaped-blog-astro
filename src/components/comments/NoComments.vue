<template>
  <div class="c-no-comments">
    <MessageSquareDashed
      :size="150"
      class="c-no-comments__icon is-one"
      stroke-width="1"
    />
    <div class="c-no-comments__text-wrap">
      <p class="c-no-comments__text is-one">
        {{ __(lang?.locale!, "comment.nothing_is_happening") }}
      </p>
      <p
        class="c-no-comments__text is-two"
        v-html="
          __(lang?.locale!, 'comments.no_comments', {
            link: '#createComment',
          })
        "
      />
    </div>
    <MessageSquareDashed
      :size="100"
      class="c-no-comments__icon is-two"
      stroke-width="1"
    />
  </div>
</template>

<script setup lang="ts">
import { currentLanguage } from "@stores/store";
import { useStore } from "@nanostores/vue";
import { __ } from "@i18n/i18n";
import { MessageSquareDashed } from "lucide-vue-next";

const lang = useStore(currentLanguage);
</script>

<style lang="scss">
@use "@styles/components/comments/no-comments";
</style>
