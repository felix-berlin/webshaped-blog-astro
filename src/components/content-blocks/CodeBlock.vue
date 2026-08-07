<template>
  <div class="c-blocks__code">
    <pre
      v-if="block.name === 'core/code'"
      :class="`${
        block.attributes?.className ? block.attributes.className : 'lang-txt'
      } line-numbers`"
    ><code>{{ block.attributes?.content }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import type { CoreCodeFragment } from "@/gql/graphql.ts";

export interface CodeBlockProps {
  block: CoreCodeFragment;
}

defineProps<CodeBlockProps>();
</script>
