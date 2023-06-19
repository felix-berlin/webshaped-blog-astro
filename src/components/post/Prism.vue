<template>
  <template v-if="false" />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";

// import PrismCss from 'prismjs/themes/prism.css';
import "prismjs/themes/prism-tomorrow.css";

import "prismjs/plugins/toolbar/prism-toolbar";
import "prismjs/plugins/toolbar/prism-toolbar.css";

import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

import "prismjs/plugins/show-language/prism-show-language";

import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";

onMounted(() => {
  // window.Prism = window.Prism || {};
  // Prism.manual = true;
  Prism.highlightAll(); // highlight your code on mount
});
</script>
