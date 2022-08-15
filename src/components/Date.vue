<template>
  <time :datetime="data.formatDateString">{{ formattedDate(date) }}</time>
</template>

<script setup lang="ts">

const props = defineProps ({
  date: {
    default: '',
    type: String,
  },
})

const data = {
  formatDateString: props.date.replace(/T/g, ' '),
}

const formattedDate = (date: string, locale = 'de-DE') => {
  const dumpSafariDateFormat = date.replace(/-/g, '/').replace(/T/g, ' ');

  const dateToFormat = new Date(dumpSafariDateFormat);

  return dateToFormat.toLocaleString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>