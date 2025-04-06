<template>
  <div ref="tabs" v-auto-animate class="c-tabs">
    <div class="c-tabs__header" role="tablist">
      <template v-for="tab in tabsProps" :key="tab.tabId">
        <button
          role="tab"
          type="button"
          :id="tab.tabId"
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
          <span v-if="typeof tab?.badge !== 'undefined'" class="c-tabs__header-badge">{{
            tab.badge
          }}</span>
        </button>
      </template>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, useSlots } from "vue";

const tabsSlots = useSlots();

const tabsProps = ref();

if (tabsSlots.default) {
  tabsProps.value = tabsSlots?.default()?.map((tab, index) => ({
    ...tab.props,
    tabId: `tab-${index}`,
    tabpanelId: `tabpanel-${index}`,
  }));
}

const selectedTabHeader = ref<string>(tabsProps.value[0]?.header);

provide("selectedTabHeader", selectedTabHeader);
provide("tabProps", tabsProps);
</script>

<style lang="scss">
@use "@styles/components/tabs/tabs.scss";
</style>
