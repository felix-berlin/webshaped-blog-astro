<template>
  <div>
    <Calendar></Calendar>
    <time
      class="c-date"
    >
    {{ formattedDate(date, props.lang?.locale ?? '') }}</time>
    <Edit3></Edit3>
    <time
      class="c-date"
    >
    {{ formattedDate(dateModified ?? '', props.lang?.locale ?? '') }}</time>
  </div>
</template>

<script setup lang="ts">
import { reactive , onMounted } from 'vue';
import { Calendar, Edit3 } from 'lucide-vue-next';

export interface DateProps {
  date: string;
  dateModified?: string;
  lang?: {
    locale: string;
  };
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
