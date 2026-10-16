<template>
  <div v-auto-animate class="c-tabs">
    <div class="c-tabs__header" role="tablist">
      <template v-for="tab in tabs" :key="tab.tabId">
        <button
          :id="tab.tabId"
          role="tab"
          type="button"
          :aria-selected="selectedTabHeader === tab.header"
          :aria-controls="tab.tabpanelId"
          :tabindex="selectedTabHeader === tab.header ? 0 : -1"
          class="c-tabs__header-button c-button c-button--outline"
          :class="{
            'is-active': selectedTabHeader === tab.header,
            'is-inactive': selectedTabHeader !== tab.header,
          }"
          @click="selectedTabHeader = tab.header"
        >
          {{ tab.header }}
          <span v-if="tab.badge !== undefined" class="c-tabs__header-badge">{{ tab.badge }}</span>
        </button>
      </template>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, ref, useSlots } from "vue";

import { SelectedTabKey, type TabMeta, TabsKey } from "./tabs";

// Tab headers come from the <TabItem> children's props, read once at setup.
const tabs: TabMeta[] = (useSlots().default?.() ?? []).map((tab, index) => ({
  ...(tab.props as Pick<TabMeta, "badge" | "header">),
  tabId: `tab-${index}`,
  tabpanelId: `tabpanel-${index}`,
}));

const selectedTabHeader = ref(tabs[0]?.header ?? "");

provide(SelectedTabKey, selectedTabHeader);
provide(TabsKey, tabs);
</script>

<style lang="scss">
@use "@styles/components/tabs/tabs.scss";
</style>
