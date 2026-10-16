<template>
  <article class="c-comment__item">
    <header class="c-comment__header">
      <div class="c-comment__author-icon">
        <User v-if="!isValidEmail" width="86" height="86" />
        <span v-else>{{ t("comment_form.gravatar_hint") }}</span>
      </div>

      <div class="c-comment__author-name-wrap">
        <h2 class="c-comment__author-name">
          {{ commentForm.author ? commentForm.author : t("comment_form.your_name") }}
        </h2>
      </div>
    </header>

    <main v-auto-animate class="c-comment__content is-comment-item">
      <slot name="beforeContent" />

      <h2 class="c-comment__headline">
        {{ t("comment_form.headline") }}
      </h2>

      <Alert
        v-if="formResponses.errors.length && showDialog"
        type="danger"
        class="c-comment__big-alert c-alert--big-centered"
      >
        <template v-for="(error, index) in formResponses.errors" :key="index">
          <XCircle class="c-comment__big-alert-icon" />
          <p class="c-comment__big-alert-text">
            {{ error.message }}
          </p>
        </template>
      </Alert>
      <Alert
        v-if="formResponses.success && showDialog"
        type="success"
        class="c-comment__big-alert c-alert--big-centered"
      >
        <CheckCircle class="c-comment__big-alert-icon" />
        <p class="c-comment__big-alert-text">
          {{ t("comment_form.success") }}
        </p>
      </Alert>

      <form v-if="!showDialog" novalidate="true" class="c-form" @submit.prevent="checkForm">
        <div
          v-auto-animate
          class="c-form__item is-vertical"
          :class="{ 'c-textarea--error': formErrors.comment }"
        >
          <label class="c-form__label" for="comment">{{ t("comment_form.comment.label") }}</label>

          <textarea
            id="comment"
            v-model="commentForm.comment"
            class="c-textarea"
            name="comment"
            rows="4"
            placeholder=" "
          />
          <Alert v-if="formErrors.comment" type="danger" class="c-alert--small">
            {{ formErrors.comment }}
          </Alert>
        </div>

        <div class="c-form__group">
          <div
            v-auto-animate
            class="c-form__item is-vertical"
            :class="{ 'has-error': formErrors.author }"
          >
            <label class="c-form__label c-label is-required" for="author">{{
              t("comment_form.name.label")
            }}</label>

            <input
              id="author"
              v-model="commentForm.author"
              class="c-input"
              type="text"
              name="author"
              placeholder=" "
            />
            <Alert v-if="formErrors.author" type="danger" class="c-alert--small">
              {{ formErrors.author }}
            </Alert>
          </div>

          <div
            v-auto-animate
            class="c-form__item is-vertical"
            :class="{ 'has-error': formErrors.email }"
          >
            <label class="c-form__label" for="user-email"
              >{{ t("comment_form.email.label") }}
              <Info
                v-tooltip="{
                  content: t('comment_form.email.tooltip'),
                  html: true,
                }"
                width="18"
                height="18"
              />
            </label>

            <input
              id="user-email"
              v-model="commentForm.email"
              class="c-input c-input--email"
              type="email"
              name="user-email"
              placeholder=" "
            />
            <Alert v-if="formErrors.email" type="danger" class="c-alert--small">
              {{ formErrors.email }}
            </Alert>
          </div>
        </div>
        <div v-auto-animate class="c-form__item" :class="{ 'has-error': formErrors.privacy }">
          <input
            id="privacy"
            v-model="commentForm.privacy"
            type="checkbox"
            name="privacy"
            class="c-input c-input--checkbox"
          />
          <label
            class="c-form__label c-label is-required"
            for="privacy"
            v-html="
              t('comment_form.privacy.label', {
                link: pagePathBuilder(PRIVACY_PAGE_SLUG, props.lang),
              })
            "
          />

          <Alert v-if="formErrors.privacy" type="danger" class="c-alert--small">
            {{ formErrors.privacy }}
          </Alert>
        </div>

        <div class="c-form__item">
          <input
            id="saveUser"
            v-model="commentForm.saveUser"
            type="checkbox"
            name="saveUser"
            class="c-input c-input--checkbox c-switch"
          />
          <label
            class="c-form__label c-label"
            for="saveUser"
            v-text="t('comment_form.save_user.label')"
          />
        </div>
        <button type="submit" class="c-button c-button--primary">
          {{ t("comment_form.submit.button") }}
        </button>
      </form>
    </main>
  </article>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import Alert from "@components/Alert.vue";
import CheckCircle from "@components/icons/CheckCircle.vue";
import XCircle from "@components/icons/XCircle.vue";
import { guest } from "@stores/store";
import { useMutation } from "@urql/vue";
import { pagePathBuilder } from "@utils/i18n/utils";
import { PRIVACY_PAGE_SLUG } from "@utils/routes";
import { promiseTimeout } from "@vueuse/core";
import Info from "virtual:icons/lucide/info";
import User from "virtual:icons/lucide/user";
import { computed, reactive, ref, watch } from "vue";

import type { CreateCommentMutationVariables } from "@/gql/graphql.ts";

import { useI18n } from "@/composables/useI18n";
import { CreateCommentDocument } from "@/gql/graphql.ts";

interface Props {
  currentPostId: string;
  lang: Lang;
  replyToCommentId?: CreateCommentMutationVariables["parent"];
}

const props = defineProps<Props>();
const emit = defineEmits<{ commentCreated: [] }>();
const { t } = useI18n(() => props.lang);

const EMAIL_RE =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface CommentForm {
  author: string;
  comment: string;
  email: string;
  privacy: boolean;
  saveUser: boolean;
}

const initialCommentForm: CommentForm = {
  author: "",
  comment: "",
  email: "",
  privacy: false,
  saveUser: false,
};

// Prefilled from the guest data a previous comment saved (see `saveUser`).
const { author = "", email = "", privacy = false, saveUser = false } = guest.get();
const commentForm = reactive<CommentForm>({
  ...initialCommentForm,
  author,
  email,
  privacy,
  saveUser,
});

const formErrors = reactive({ author: "", comment: "", email: "", privacy: "" });

const formResponses = reactive<{ errors: { message: string }[]; success: boolean }>({
  errors: [],
  success: false,
});

const showDialog = ref(false);

const isValidEmail = computed(() => EMAIL_RE.test(commentForm.email));

const resetCommentForm = () => Object.assign(commentForm, initialCommentForm);

/** Validates the form and submits it when every field passes. */
const checkForm = async (): Promise<void> => {
  // Start clean: a stale error (e.g. on an e-mail since emptied) would block submit for good.
  Object.assign(formErrors, { author: "", comment: "", email: "", privacy: "" });

  if (commentForm.comment.length <= 1) {
    formErrors.comment = t.value("comment_form.error.comment_to_short");
  }

  if (commentForm.author.length <= 1) {
    formErrors.author = t.value("comment_form.error.author_to_short");
  }

  // The e-mail address is optional, but must be valid if given.
  if (commentForm.email && !isValidEmail.value) {
    formErrors.email = t.value("comment_form.error.email_invalid");
  }

  if (!commentForm.privacy) {
    formErrors.privacy = t.value("comment_form.error.privacy_not_accepted");
  }

  if (Object.values(formErrors).every((error) => !error)) await create();
};

const createComment = useMutation(CreateCommentDocument);

/** Shows the success/error dialog for three seconds. */
const flashDialog = async (): Promise<void> => {
  showDialog.value = true;
  await promiseTimeout(3000);
  showDialog.value = false;
};

const create = async (): Promise<void> => {
  const { data, error } = await createComment.executeMutation({
    author: commentForm.author,
    authorEmail: commentForm.email,
    commentOn: Number(props.currentPostId),
    content: commentForm.comment,
    parent: props.replyToCommentId,
  });

  // `success: false` (or a null payload) is a failure too: keep the typed comment.
  const success = !error && !!data?.createComment?.success;

  formResponses.success = success;
  formResponses.errors = success
    ? []
    : [error ?? { message: t.value("comment_form.error.not_created") }];
  await flashDialog();
  formResponses.success = false;
  formResponses.errors = [];

  if (!success) return;

  const { comment: _comment, ...guestData } = commentForm;
  guest.set(commentForm.saveUser ? guestData : { saveUser: false });

  emit("commentCreated");

  if (!commentForm.saveUser) resetCommentForm();
  commentForm.comment = "";
};

// Clear a field's error as soon as it gets a value again.
for (const field of ["author", "comment", "email", "privacy"] as const) {
  watch(
    () => commentForm[field],
    (value) => {
      if (value) formErrors[field] = "";
    },
  );
}
</script>

<style lang="scss">
@use "@styles/components/form.scss";
@use "@styles/components/inputs.scss";
</style>
