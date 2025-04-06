<template>
  <div
    v-if="selectedTabHeader === header"
    class="c-tab"
    tabindex="0"
    :id="currentTab?.tabpanelId"
    role="tabpanel"
    :hidden="selectedTabHeader !== header"
    :aria-labelledby="currentTab?.tabId"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import type { Ref } from "vue";

export interface TabProps {
  header: string;
  badge?: string | number;
}

const { header, badge } = defineProps<TabProps>();

const selectedTabHeader = inject("selectedTabHeader") as Ref<string>;
const tabProps = inject("tabProps") as Ref<
  Array<{ tabId: string; tabpanelId: string; header: string }>
>;

// Find the current tab's properties based on the header
const currentTab = ref(tabProps.value?.find((tab) => tab.header === header));
</script>

<style scoped></style>
