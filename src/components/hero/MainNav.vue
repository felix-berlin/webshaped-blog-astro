<template>
  <nav class="c-main-nav u-glas-background">
    <Logo />

    <button
      v-show="isMobile"
      type="button"
      class="c-main-nav__toggle c-button c-button--icon"
      :aria-label="t('main_nav.toggle_button.label')"
      :aria-expanded="flyoutIsOpen"
      @click="toggleFlyout"
    >
      <MenuIcon class="c-main-nav__menu-icon is-mobile" />
    </button>

    <Teleport v-if="isMobile" to="#mainHeader">
      <Transition name="fade">
        <div v-if="flyoutIsOpen" class="c-main-nav__flyout" :class="{ 'is-open': flyoutIsOpen }">
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
import { ref, onMounted } from "vue";
import Logo from "@components/Logo.vue";
import MenuIcon from "virtual:icons/lucide/menu";
import MenuNav from "@components/menu-nav/MenuNav.vue";
import ButtonBar from "@components/main-nav/ButtonBar.vue";
import { useI18n } from "@/composables/useI18n";
import { useStore } from "@nanostores/vue";
import { isMobileBreakpoint, windowWidth, translationRoutes } from "@stores/store";
import { useResizeObserver } from "@vueuse/core";
import type { MenuToMenuItemConnection } from "@ts_types/generated/graphql";
import type { TranslationRoutes } from "@layouts/DefaultLayout.astro";

export interface MainNavProps {
  menuItems: MenuToMenuItemConnection;
  translationsRoutes?: TranslationRoutes;
}

const { menuItems, translationsRoutes } = defineProps<MainNavProps>();

const isMobile = useStore(isMobileBreakpoint);
const flyoutIsOpen = ref(false);
const submenuIsOpen = ref(false);
const { t } = useI18n();

translationRoutes.set(translationsRoutes);

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
  /**
   * This code snippet uses the ResizeObserver API to observe the width of the body element and update the values of 'isMobile' variables accordingly.
   * It also disables or enables scroll on the body element based on the width and the state of the flyout menu.
   *
   * @param   {object}  entries
   *
   * @return  {void}
   */
  useResizeObserver(document.body, (entries) => {
    // Cache the computed style of the body element
    const bodyStyle = window.getComputedStyle(document.body);

    // Get the width of the body element and add the body padding
    const bodyPadding = ["padding-left", "padding-right"].reduce(
      (acc, prop) => acc + parseInt(bodyStyle.getPropertyValue(prop)),
      0,
    );
    const bodyWidth = entries[0].contentRect.width + bodyPadding;

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
});
</script>

<style lang="scss">
@use "@styles/components/main-nav";
</style>
