<template>
  <time
    class="c-date"
  >{{ formattedDate(date, props.lang?.locale) }}</time>
</template>

<script setup lang="ts">
import { reactive , onMounted } from 'vue';

export interface DateProps {
  date: string;
  lang?: object;
}

const props = defineProps<DateProps>()

// const data = {
//   formatDateString: props.date.replace(/T/g, ' '),
// }


const formattedDate = (date: string, locale: string) => {
  const dumpSafariDateFormat = date.replace(/-/g, '/').replace(/T/g, ' ');

  if (!locale) {
    locale = 'de-DE';
  }
  const formattedLocale = locale.replace(/_/g, '-')

  const dateToFormat = new Date(dumpSafariDateFormat);

  return dateToFormat.toLocaleString(formattedLocale, { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>
