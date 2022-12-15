<template>
  <div class="c-green-hosted">
    <a href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fwebshaped.de">
      <Leaf :size="16"/>
      {{ __(lang.locale, 'green_hosted') }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { Leaf } from 'lucide-vue-next';
import { __ } from '@i18n/i18n';

interface GreenHostedProps {
  lang: {
    locale: string;
  },
}

const props = defineProps<GreenHostedProps>()
</script>

<style scoped>

</style>
