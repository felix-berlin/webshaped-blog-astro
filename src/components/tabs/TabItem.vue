<template>
  <div
    v-if="selectedTabHeader === header"
    :id="currentTab?.tabpanelId"
    class="c-tab"
    tabindex="0"
    role="tabpanel"
    :hidden="selectedTabHeader !== header"
    :aria-labelledby="currentTab?.tabId"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";

import { inject, ref } from "vue";

export interface TabProps {
  badge?: number | string;
  header: string;
}

const { badge, header } = defineProps<TabProps>();

const selectedTabHeader = inject("selectedTabHeader") as Ref<string>;
const tabProps = inject("tabProps") as Ref<
  Array<{ header: string; tabId: string; tabpanelId: string }>
>;

// Find the current tab's properties based on the header
const currentTab = ref(tabProps.value?.find((tab) => tab.header === header));
</script>

<style scoped></style>
