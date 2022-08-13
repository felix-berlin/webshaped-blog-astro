<template>
  <time>{{ formattedDate(date) }}</time>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent ({
  name: 'Date',

  props: {
    date: {
      default: '',
      type: String,
    },
  },

  methods: {
    formattedDate (date: string, locale = 'de-DE') {
      const dumpSafariDateFormat = date.replace(/-/g, '/').replace(/T/g, ' ');

      const dateToFormat = new Date(dumpSafariDateFormat);

      return dateToFormat.toLocaleString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    }
  },

})
</script>