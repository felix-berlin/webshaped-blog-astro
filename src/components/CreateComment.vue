<template>
  <div>
    <h2>Create Comment</h2>
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
        >Deine E-Mailadresse (optional)</label>
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
        >Author</label>
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
        >Schreibe einen Kommentar</label>
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
        Submit
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
// import { useTranslation } from "i18next-vue";
import { createComment } from '../lib/api'
import { ref, onMounted, reactive } from 'vue';
import { useStore } from '@nanostores/vue';
import { loadingState } from '../../store/store'
import Alert from '@components/Alert.vue';


// import { useTranslation } from "i18next-vue";
// const { t, i18next } = useTranslation();
// const { i18next, t } = useTranslation();

// const locales = {
//   en: {
//     comment_label: 'Hello!',
//   },
//   de: {
//     comment_label: 'Hallo!',
//   }
// };

// i18next.init({
//   lng: 'en',
//   resources: {
//     en: { translation: locales.en },
//   },
// });

interface Props {
  currentPostId: number;
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

const checkForm = () => {
  // for (const error in formErrors) {
  //   formErrors[error] = ''
  // }
  if (commentForm.comment.length <= 1) {
    formErrors.comment = 'Kommentar ist zu kurz';
  }

  if (commentForm.author.length <= 1) {
    formErrors.author = 'Du hast nen sehr kleinen Namen'
  }

  // If an e-mail address is given, validate it
  if (commentForm.email.length > 0 && !validEmail(commentForm.email)) {
    formErrors.email = 'Bitte überprüfe deine E-Mailadresse, das Format scheint nicht korrekt zu sein.';
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
const validEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return re.test(email)
}

async function create() {
  return await createComment(props.currentPostId, commentForm.comment, commentForm.author, commentForm.email)
  .then(({res}) => console.log(res))
  .then(data => console.log(data)).catch(err => console.log(err))
};


onMounted(() => {
  // createComment(767, 'Test Kommentar', 'Felix Test');
  // console.log(create());

})
</script>


<!-- <i18n lang="yaml">
  en:
    comment_label: 'Hello!'
  de:
    comment_label: 'Hallo!'
</i18n> -->
<style scoped>

</style>
