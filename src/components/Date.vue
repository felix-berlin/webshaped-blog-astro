<template>
  <div class="c-date">
    <slot name="before"></slot>

    <time
      class="c-date"
      v-text="formattedDate(date, props.lang?.locale ?? '')"
    />

    <slot name="after"></slot>
  </div>
</template>

<script setup lang="ts">
export interface DateProps {
  date: string;
  lang?: {
    locale: string;
  };
}

const props = defineProps<DateProps>()

const formattedDate = (date: string, locale: string): string => {
  const dumpSafariDateFormat = date.replace(/-/g, '/').replace(/T/g, ' ');

  if (!locale) locale = 'de-DE';

  const formattedLocale = locale.replace(/_/g, '-')

  const dateToFormat = new Date(dumpSafariDateFormat);

  return dateToFormat.toLocaleString(formattedLocale, { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>
