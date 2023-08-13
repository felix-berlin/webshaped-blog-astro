<template>
  <article class="c-comment__item">
    <header class="c-comment__header">
      <div class="c-comment__author-icon">
        <User v-if="!validEmail(commentForm.email)" :size="86" />
        <span v-else>{{
          __(props.lang?.locale!, "comment_form.gravatar_hint")
        }}</span>
      </div>

      <div class="c-comment__author-name-wrap">
        <h2 class="c-comment__author-name">
          {{
            commentForm.author
              ? commentForm.author
              : __(props.lang?.locale!, "comment_form.your_name")
          }}
        </h2>
      </div>
    </header>

    <main v-auto-animate class="c-comment__content is-comment-item">
      <slot name="beforeContent" />

      <h2 class="c-comment__headline">
        {{ __(props.lang?.locale!, "comment_form.headline") }}
      </h2>

      <Alert
        v-if="
          formResponses?.errors && formResponses.errors.length > 0 && showDialog
        "
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
      </Alert>

      <form
        v-if="!showDialog"
        novalidate="true"
        class="c-form"
        @submit.prevent="checkForm"
      >
        <div
          v-auto-animate
          class="c-form__item is-vertical"
          :class="{ 'c-textarea--error': formErrors.comment.length }"
        >
          <label class="c-form__label" for="comment">{{
            __(props.lang?.locale!, "comment_form.comment.label")
          }}</label>

          <textarea
            id="comment"
            v-model="commentForm.comment"
            class="c-textarea"
            name="comment"
            rows="4"
            placeholder=" "
          />
          <Alert
            v-if="formErrors.comment.length"
            type="danger"
            class="c-alert--small"
          >
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
              __(props.lang?.locale!, "comment_form.name.label")
            }}</label>

            <input
              id="author"
              v-model="commentForm.author"
              class="c-input"
              type="text"
              name="author"
              placeholder=" "
            />
            <Alert
              v-if="formErrors.author.length"
              type="danger"
              class="c-alert--small"
            >
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
              >{{ __(props.lang?.locale!, "comment_form.email.label") }}
              <Info
                v-tooltip="{
                  content: __(
                    props.lang?.locale!,
                    'comment_form.email.tooltip',
                  ),
                  html: true,
                }"
                :size="18"
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
              __(props.lang?.locale!, 'comment_form.privacy.label', {
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
            v-text="__(props.lang?.locale!, 'comment_form.save_user.label')"
          />
        </div>
        <button type="submit" class="c-button c-button--primary">
          {{ __(props.lang?.locale!, "comment_form.submit.button") }}
        </button>
      </form>
    </main>
  </article>
</template>

<script setup lang="ts">
import { createComment, CreateCommentPayloadExtended } from "@services/api";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "@nanostores/vue";
import { guest } from "@stores/store";
import Alert from "@components/Alert.vue";
import { __ } from "@i18n/i18n";
import { User, Info } from "lucide-vue-next";
import type {
  Language,
  Maybe,
  CreateCommentInput,
} from "../../types/generated/graphql";
import CheckCircle from "@components/icons/CheckCircle.vue";
import XCircle from "@components/icons/XCircle.vue";
import { promiseTimeout } from "@vueuse/core";
import { excludeObjectKeys } from "@utils/objectHelpers";

interface Props {
  currentPostId: number;
  lang: Maybe<Language>;
  replyToCommentId?: CreateCommentInput["parent"] | number;
}

const props = defineProps<Props>();

const guestUser = useStore(guest);

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

const emit = defineEmits(["commentCreated", "comment-created"]);

// reset commentForm function
const resetCommentForm = () => {
  Object.keys(commentForm).forEach((value) => {
    if (typeof commentForm[value as keyof CommentForm] === "string") {
      commentForm[value as keyof CommentForm] = "";
    } else if (typeof commentForm[value as keyof CommentForm] === "boolean") {
      commentForm[value as keyof CommentForm] = false;
    }
  });
};

// reset formErrors function
const resetFormErrors = () => {
  Object.keys(formErrors).forEach(
    (value) => (formErrors[value as keyof CommentForm] = ""),
  );
};

/**
 * checks if the given form data is valid
 *
 * @return  {void}
 */
const checkForm = (): void => {
  if (commentForm.comment.length <= 1) {
    formErrors.comment = __(
      props.lang?.locale,
      "comment_form.error.comment_to_short",
    );
  }

  if (commentForm.author.length <= 1) {
    formErrors.author = __(
      props.lang?.locale,
      "comment_form.error.author_to_short",
    );
  }

  // If an e-mail address is given, validate it
  if (
    commentForm.email &&
    commentForm.email.length > 0 &&
    !validEmail(commentForm.email)
  ) {
    formErrors.email = __(
      props.lang?.locale,
      "comment_form.error.email_invalid",
    );
  }

  if (!commentForm.privacy) {
    formErrors.privacy = __(
      props.lang?.locale,
      "comment_form.error.privacy_not_accepted",
    );
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
async function create(): Promise<void> {
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

        resetCommentForm();
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
}

watch(commentForm, (newValue, oldValue) => {
  if (newValue.comment && formErrors.comment.length > 0) {
    formErrors.comment = "";
  }

  if (newValue.author && formErrors.author.length > 0) {
    formErrors.author = "";
  }

  if (newValue.email && formErrors.email && formErrors?.email?.length > 0) {
    formErrors.email = "";
  }

  if (newValue.privacy && formErrors.privacy.length > 0) {
    formErrors.privacy = "";
  }
});

watch(guestUser, (newValue, oldValue) => {
  // if (newValue.author && commentForm.author !== newValue.author) {
  //   commentForm.author = newValue.author;
  // }
  // if (newValue.email && commentForm.email !== newValue.email) {
  //   commentForm.email = newValue.email;
  // }
  // if (newValue.privacy && commentForm.privacy !== newValue.privacy) {
  //   commentForm.privacy = newValue.privacy;
  // }
  // if (newValue.saveUser && commentForm.saveUser !== newValue.saveUser) {
  //   commentForm.saveUser = newValue.saveUser;
  // }
});

onMounted(() => {
  if (guestUser.value.author) commentForm.author = guestUser.value.author;
  if (guestUser.value.email) commentForm.email = guestUser.value.email;
  if (guestUser.value.privacy) commentForm.privacy = guestUser.value.privacy;
  if (guestUser.value.saveUser) commentForm.saveUser = guestUser.value.saveUser;
});
</script>
<style lang="scss">
@use "@styles/components/form.scss";
@use "@styles/components/inputs.scss";
</style>
