<template>
  <component
    :is="elementIs"
    class="c-webmentions-count"
  >
    <AtSign
      aria-label="Webmentions Anzahl"
      class="c-webmentions-count__icon"
      :size="18"
    />
    <span class="c-webmentions-count__count">
      {{ __(lang.locale, 'webmentions_count.label--plural', {count: count}, count) }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { currentWebmentionsCount } from '@stores/store';
import { AtSign } from 'lucide-vue-next'
import { __ } from '@i18n/i18n'

interface WebmentionsCountProps {
  elementIs?: string;
  lang: {
    locale: string;
  };
}

const props = withDefaults(defineProps<WebmentionsCountProps>(), {
  elementIs: 'div'
});

const count = useStore(currentWebmentionsCount)


</script>

<style scoped>

</style>
