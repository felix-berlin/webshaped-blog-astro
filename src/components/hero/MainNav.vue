<template>
  <nav ref="mainNav" class="c-main-nav u-glas-background">
    <Logo />

    <!-- <LanguageSelect /> -->

    <button
      v-show="isMobile"
      type="button"
      class="c-main-nav__toggle c-button c-button--icon"
      :aria-label="__(lang?.locale!, 'main_nav.toggle_button.label')"
      :aria-expanded="flyoutIsOpen"
      @click="toggleFlyout"
    >
      <MenuIcon class="c-main-nav__menu-icon is-mobile" />
    </button>

    <Teleport v-if="isMobile" to="#mainHeader">
      <Transition name="fade">
        <div
          v-if="flyoutIsOpen"
          class="c-main-nav__flyout"
          :class="{ 'is-open': flyoutIsOpen }"
        >
          <MenuNav
            :menu-items="menuItems.nodes"
            class="c-main-nav__menu"
            :class="{ 'is-open': flyoutIsOpen }"
            @submenu-state="submenuIsOpen = $event"
            @menu-item-target-clicked="toggleFlyout"
          />

          <ButtonBar />
        </div>
      </Transition>
    </Teleport>

    <MenuNav
      v-else
      :menu-items="menuItems.nodes"
      class="c-main-nav__menu"
      :class="{ 'is-open': submenuIsOpen }"
      @submenu-state="submenuIsOpen = $event"
    />

    <ButtonBar v-if="!isMobile" />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import LanguageSelect from "@components/LanguageSelect.vue";
import Logo from "@components/Logo.vue";
import MenuIcon from "virtual:icons/lucide/menu";
import MenuNav from "@components/menu-nav/MenuNav.vue";
import ButtonBar from "@components/main-nav/ButtonBar.vue";
import { __ } from "@i18n/i18n";
import { useStore } from "@nanostores/vue";
import { isMobileBreakpoint, windowWidth } from "@stores/store";
import type {
  Language,
  MenuToMenuItemConnection,
  Maybe,
} from "@ts_types/generated/graphql";

export interface MainNavProps {
  menuItems: MenuToMenuItemConnection;
  lang: Maybe<Language>;
}

defineProps<MainNavProps>();

const isMobile = useStore(isMobileBreakpoint);
const mainNav = ref(null);
const flyoutIsOpen = ref(false);
const submenuIsOpen = ref(false);
const bodyWidthObserver: Ref<ResizeObserver | undefined> = ref();

/**
 * Toggle the flyout menu
 *
 * @return  {void}
 */
const toggleFlyout = (): void => {
  flyoutIsOpen.value = !flyoutIsOpen.value;
  controlScroll(flyoutIsOpen.value);
};

/**
 * This code snippet uses the ResizeObserver API to observe the width of the body element and update the values of 'isMobile' variables accordingly.
 * It also disables or enables scroll on the body element based on the width and the state of the flyout menu.
 *
 * @param   {object}  entries
 *
 * @return  {void}
 */
bodyWidthObserver.value = new ResizeObserver((entries) => {
  const bodyWidth = entries[0].contentBoxSize[0].inlineSize;

  // Update the value of 'isMobile' based on the current screen width
  isMobileBreakpoint.set(bodyWidth < 769);
  windowWidth.set(bodyWidth);

  // If the screen width is not mobile
  if (!isMobile.value) {
    // Close the flyout menu
    flyoutIsOpen.value = false;

    // Enable scroll on the body element
    controlScroll(false);
  }
});

/**
 * Toggle disable scroll on body
 *
 * @param   {boolean}  status  yes/no
 *
 * @return  {void}
 */
const controlScroll = (status: boolean): void => {
  if (status) document.body.style.overflow = "hidden";
  if (!status) document.body.removeAttribute("style");
};

/**
 * Observes the width of the body element using the ResizeObserver API.
 * Disables or enables scroll on the body element based on the width and the state of the flyout menu.
 */
onMounted(() => {
  if (bodyWidthObserver.value) bodyWidthObserver.value.observe(document.body);
});

onUnmounted(() => {
  if (bodyWidthObserver.value) bodyWidthObserver.value.disconnect();
});
</script>

<style lang="scss">
@use "@styles/components/main-nav";
</style>
