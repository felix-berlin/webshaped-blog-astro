<template>
  <article class="c-comment__item">
    <header class="c-comment__header">
      <div class="c-comment__author-icon">
        <User v-if="!validEmail(commentForm.email)" width="86" height="86" />
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
        v-if="formResponses?.errors && formResponses.errors.length > 0 && showDialog"
        type="danger"
        class="c-comment__big-alert c-alert--big-centered"
      >
        <template v-for="error in formResponses.errors" :key="error">
          <XCircle class="c-comment__big-alert-icon" />
          <p class="c-comment__big-alert-text">{{ error.message }}</p>
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
          :class="{ 'c-textarea--error': formErrors.comment.length }"
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
          <Alert v-if="formErrors.comment.length" type="danger" class="c-alert--small">
            {{ formErrors.comment }}
          </Alert>
        </div>

        <div class="c-form__group">
          <div
            v-auto-animate
            class="c-form__item is-vertical"
            :class="{ 'has-error': formErrors.author.length }"
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
            <Alert v-if="formErrors.author.length" type="danger" class="c-alert--small">
              {{ formErrors.author }}
            </Alert>
          </div>

          <div
            v-auto-animate
            class="c-form__item is-vertical"
            :class="{
              'has-error': formErrors.email && formErrors.email.length,
            }"
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
            <Alert
              v-if="formErrors.email && formErrors.email.length"
              type="danger"
              class="c-alert--small"
            >
              {{ formErrors.email }}
            </Alert>
          </div>
        </div>
        <div
          v-auto-animate
          class="c-form__item"
          :class="{
            'has-error': formErrors.privacy && formErrors.privacy.length,
          }"
        >
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
                link: '/impressum',
              })
            "
          />

          <Alert
            v-if="formErrors.privacy && formErrors.privacy.length"
            type="danger"
            class="c-alert--small"
          >
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
import { createComment, type CreateCommentPayloadExtended } from "@services/api";
import { onMounted, reactive, ref, watch } from "vue";
import { mapStores } from "@nanostores/vue";
import { guest, currentLanguage } from "@stores/store";
import Alert from "@components/Alert.vue";
import { useTranslations } from "@utils/i18n/utils";
import User from "virtual:icons/lucide/user";
import Info from "virtual:icons/lucide/info";
import type { CreateCommentInput } from "@ts_types/generated/graphql";
import CheckCircle from "@components/icons/CheckCircle.vue";
import XCircle from "@components/icons/XCircle.vue";
import { promiseTimeout } from "@vueuse/core";
import { excludeObjectKeys } from "@utils/objectHelpers";

interface Props {
  currentPostId: number;
  replyToCommentId?: CreateCommentInput["parent"] | number;
}

const props = defineProps<Props>();

const { guestUser, lang } = mapStores({
  guestUser: guest,
  lang: currentLanguage,
});

interface CommentForm {
  comment: string;
  author: string;
  email?: string;
  privacy: boolean;
  saveUser?: boolean;
}

interface FormErrors {
  comment: string;
  author: string;
  email?: string;
  privacy: string;
}

const commentForm: CommentForm = reactive({
  comment: "",
  author: "",
  email: "",
  privacy: false,
  saveUser: false,
});

const formErrors: FormErrors = reactive({
  comment: "",
  author: "",
  email: "",
  privacy: "",
});

const formResponses: {
  success: CreateCommentPayloadExtended["success"];
  errors: CreateCommentPayloadExtended["errors"];
} = reactive({
  success: false,
  errors: [],
});

const showDialog = ref(false);
const t = useTranslations(lang);

const emit = defineEmits(["commentCreated", "comment-created"]);

// reset commentForm function
const resetCommentForm = () => {
  Object.keys(commentForm).forEach((value) => {
    if (typeof commentForm[value as keyof CommentForm] === "string") {
      commentForm[value as keyof CommentForm] = "" as never;
    } else if (typeof commentForm[value as keyof CommentForm] === "boolean") {
      commentForm[value as keyof CommentForm] = false as never;
    }
  });
};

// reset formErrors function
const resetFormErrors = () => {
  Object.keys(formErrors).forEach((value) => (formErrors[value as keyof CommentForm] = ""));
};

/**
 * checks if the given form data is valid
 *
 * @return  {void}
 */
const checkForm = (): void => {
  if (commentForm.comment.length <= 1) {
    formErrors.comment = t("comment_form.error.comment_to_short");
  }

  if (commentForm.author.length <= 1) {
    formErrors.author = t("comment_form.error.author_to_short");
  }

  // If an e-mail address is given, validate it
  if (commentForm.email && commentForm.email.length > 0 && !validEmail(commentForm.email)) {
    formErrors.email = t("comment_form.error.email_invalid");
  }

  if (!commentForm.privacy) {
    formErrors.privacy = t("comment_form.error.privacy_not_accepted");
  }

  if (Object.values(formErrors).every((v) => v.length === 0)) {
    create();
  }
};

/**
 * Checks if its a real email address
 *
 * @param   {String}  email  E-Mail address
 *
 * @return  {Boolean}        If check passes return true
 */
const validEmail = (email: string | undefined): boolean | undefined => {
  if (!email && typeof email === "undefined") return;
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
};

/**
 * Send a GraphQL request to create a comment
 *
 * @return  {Promise}
 */
const create = async (): Promise<void> => {
  await createComment(
    props.currentPostId,
    commentForm.comment,
    commentForm.author,
    commentForm.email,
    props.replyToCommentId,
  ).then(
    async (response) => {
      if (commentForm.saveUser) {
        console.log("save user", excludeObjectKeys(commentForm, ["comment"]));
        guest.set(excludeObjectKeys(commentForm, ["comment"]));
      }

      if (!commentForm.saveUser) {
        guest.set({ saveUser: false });
      }

      if (typeof response?.data?.createComment?.success !== "undefined") {
        formResponses.success = response?.data.createComment.success;
        showDialog.value = true;

        await promiseTimeout(3000);

        showDialog.value = false;
        formResponses.success = false;

        emit("commentCreated");

        if (!commentForm.saveUser) resetCommentForm();
        commentForm.comment = "";
      }

      if (typeof response.errors !== "undefined") {
        formResponses.errors = response.errors;
        showDialog.value = true;

        await promiseTimeout(3000);

        showDialog.value = false;
        formResponses.errors = [];
      }
    },
    (error) => {
      console.error("oh no, login failed", error);
    },
  );
};

watch(commentForm, (newValue, oldValue) => {
  Object.keys(newValue).forEach((key) => {
    if (
      newValue[key as keyof CommentForm] &&
      (formErrors[key as keyof FormErrors]?.length ?? 0) > 0
    ) {
      formErrors[key as keyof FormErrors] = "";
    }
  });
});

onMounted(() => {
  if (guestUser.author) commentForm.author = guestUser.author;
  if (guestUser.email) commentForm.email = guestUser.email;
  if (guestUser.privacy) commentForm.privacy = guestUser.privacy;
  if (guestUser.saveUser) commentForm.saveUser = guestUser.saveUser;
});
</script>

<style lang="scss">
@use "@styles/components/form.scss";
@use "@styles/components/inputs.scss";
</style>
