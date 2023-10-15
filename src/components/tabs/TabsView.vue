<template>
  <div ref="tabs" v-auto-animate class="c-tabs">
    <ol class="c-tabs__header u-list-reset">
      <li v-for="(tab, index) in tabsProps" :key="index" class="c-tabs__header-item">
        <button
          type="button"
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
      </li>
    </ol>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, useSlots } from "vue";

const tabsSlots = useSlots();

const tabsProps = ref();

if (tabsSlots.default) {
  tabsProps.value = tabsSlots?.default()?.map((tab) => tab.props);
}
const selectedTabHeader = ref(tabsProps?.value[0]?.header);

provide("selectedTabHeader", selectedTabHeader);
</script>

<style lang="scss">
@use "@styles/components/tabs/tabs.scss";
</style>
