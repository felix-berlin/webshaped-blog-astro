<template>
  <time
    :datetime="data.formatDateString"
    class="c-date"
  >{{ formattedDate(date, state.userLang) }}</time>
</template>

<script setup lang="ts">
import { reactive , onMounted } from 'vue';

export interface DateProps {
  date: string;
}

const props = defineProps<DateProps>()

const data = {
  formatDateString: props.date.replace(/T/g, ' '),
}

interface State {
  userLang: string;
}

const state: State = reactive({ userLang: 'de-DE'});

onMounted(() => {
  state.userLang = window.navigator.language
})

const formattedDate = (date: string, locale = 'de-DE') => {
  const dumpSafariDateFormat = date.replace(/-/g, '/').replace(/T/g, ' ');

  const dateToFormat = new Date(dumpSafariDateFormat);

  return dateToFormat.toLocaleString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>
