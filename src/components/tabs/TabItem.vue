<template>
  <div
    v-if="selectedTabHeader === header"
    :id="currentTab?.tabpanelId"
    class="c-tab"
    tabindex="0"
    role="tabpanel"
    :aria-labelledby="currentTab?.tabId"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";

import { SelectedTabKey, TabsKey } from "./tabs";

export interface TabProps {
  /** Read by TabsView from the slot vnode to render a badge next to the header. */
  badge?: number | string;
  header: string;
}

const { header } = defineProps<TabProps>();

const selectedTabHeader = inject(SelectedTabKey, ref(""));
const currentTab = inject(TabsKey, []).find((tab) => tab.header === header);
</script>
