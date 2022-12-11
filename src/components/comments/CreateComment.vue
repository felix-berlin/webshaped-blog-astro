<template>
  <div>
    <h2>{{ __(props.lang.locale, 'comment_form.headline') }}</h2>
    <Alert
      v-if="formResponseErrors.length > 0"
      type="danger"
      class="c-alert--small"
    >
      <template v-for="error in formResponseErrors">
        {{ error.message }}
      </template>
    </Alert>
    <form
      novalidate="true"
      @submit.prevent="checkForm"
    >
      <div
        class="c-form__item is-vertical"
        :class="{'has-error': formErrors.email.length}"
      >
        <label
          class="c-label c-form__label"
          for="user-email"
        >{{ __(props.lang.locale, 'comment_form.email.label') }}</label>
        <div class="c-floating-label">
          <input
            id="user-email"
            v-model="commentForm.email"
            class="c-input c-form__input c-input--email c-floating-label__input"
            type="email"
            name="user-email"
            placeholder=" "
          >
          <Alert
            v-if="formErrors.email.length"
            type="danger"
            class="c-floating-label__label c-floating-label__label--bottom c-alert--small"
          >
            {{ formErrors.email }}
          </Alert>
        </div>
      </div>

      <div
        class="c-form__item is-vertical"
        :class="{'has-error': formErrors.author.length}"
      >
        <label
          class="c-form__label c-label is-required"
          for="author"
        >{{ __(props.lang.locale, 'comment_form.name.label') }}</label>
        <div class="c-floating-label">
          <input
            id="author"
            v-model="commentForm.author"
            class="c-input c-form__input c-floating-label__input"
            type="text"
            name="author"
            placeholder=" "
          >
          <Alert
            v-if="formErrors.author.length"
            type="danger"
            class="c-floating-label__label c-floating-label__label--bottom c-alert--small"
          >
            {{ formErrors.author }}
          </Alert>
        </div>
      </div>

      <div
        class="c-form__item is-vertical"
        :class="{'c-textarea--error': formErrors.comment.length}"
      >
        <label
          class="c-label c-form__label"
          for="comment"
        >{{ __(props.lang.locale, 'comment_form.comment.label') }}</label>
        <div class="c-floating-label">
          <textarea
            id="comment"
            v-model="commentForm.comment"
            class="c-textarea c-floating-label__input"
            name="comment"
            rows="4"
            placeholder=" "
          />
          <Alert
            v-if="formErrors.comment.length"
            type="danger"
            class="c-floating-label__label c-floating-label__label--bottom c-alert--small"
          >
            {{ formErrors.comment }}
          </Alert>
        </div>
      </div>
      <button
        type="submit"
      >
        {{ __(props.lang.locale, 'comment_form.submit.button') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { createComment } from '@lib/api'
import { ref, onMounted, reactive } from 'vue';
import { useStore } from '@nanostores/vue';
import { loadingState } from '@stores/store'
import Alert from '@components/Alert.vue';
import { __ } from '@i18n/i18n';

interface Props {
  currentPostId: number;
  lang: {
    locale: string;
  };
}

const props = defineProps<Props>()

const user = useStore(loadingState)

interface CommentForm {
  comment: string;
  author: string;
  email?: string;
}

const commentForm: CommentForm = reactive({
  comment: '',
  author: '',
  email: '',
})

const formErrors = reactive({
  comment: '',
  author: '',
  email: '',
})

let formResponseErrors:Array<Object> = [];

const checkForm = () => {
  if (commentForm.comment.length <= 1) {
    formErrors.comment = __(props.lang.locale, 'comment_form.error.comment_to_short');
  }

  if (commentForm.author.length <= 1) {
    formErrors.author = __(props.lang.locale, 'comment_form.error.author_to_short');
  }

  // If an e-mail address is given, validate it
  if (commentForm.email && commentForm.email.length > 0 && !validEmail(commentForm.email)) {
    formErrors.email = __(props.lang.locale, 'comment_form.error.email_invalid');
  }

  if (Object.values(formErrors).every(v => v.length === 0)) {
    create()
  }
}

/**
  * Checks if its a real email address
  *
  * @param   {String}  email  E-Mail address
  *
  * @return  {Boolean}        If check passes return true
  */
const validEmail = (email: string | undefined): boolean | undefined => {
  if (!email && typeof email === 'undefined') return;
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return re.test(email)
}

async function create() {
  await createComment(
    props.currentPostId,
    commentForm.comment,
    commentForm.author,
    commentForm.email
  ).then(
    data => {
      if (typeof data.errors !== 'undefined') {
        formResponseErrors = data.errors;
      }
    },
    error => {
      console.error('oh no, login failed', error)
    },
  );
};


onMounted(() => {


})
</script>
<style scoped>

</style>
