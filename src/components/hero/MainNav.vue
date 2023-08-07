/* stylelint-disable value-keyword-case */
<template>
  <nav ref="mainNav" class="c-main-nav">
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

          <ColorModeToggle />
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
    <!-- <Transition v-else name="fade">
      <div v-show="flyoutIsOpen" class="c-main-nav__flyout">
      </div>
    </Transition> -->

    <ColorModeToggle v-if="!isMobile" class="c-main-nav__color-toggle" />
  </nav>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import ColorModeToggle from "@components/ColorModeToggle.vue";
import LanguageSelect from "@components/LanguageSelect.vue";
import Logo from "@components/Logo.vue";
import { Menu as MenuIcon, X } from "lucide-vue-next";
import { useMouseInElement } from "@vueuse/core";
import { __ } from "@i18n/i18n";
import MenuNav from "@components/menu-nav/MenuNav.vue";
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

const mainHeaderWidth = ref(0);
const mainNav = ref(null);
const isMobile = ref(false);
const flyoutIsOpen = ref(false);
const submenuIsOpen = ref(false);

const mouse = reactive(useMouseInElement(mainNav));

const gradientPrimaryPostion = computed(() => {
  return mouse.isOutside
    ? "55%"
    : `${(mouse.elementX * 100) / mouse.elementWidth}%`;
});
const gradientSecondaryPostion = computed(() => {
  return mouse.isOutside ? "14%" : "0%";
});

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
 * This code snippet uses the ResizeObserver API to observe the width of the body element and update the values of 'mainHeaderWidth' and 'isMobile' variables accordingly.
 * It also disables or enables scroll on the body element based on the width and the state of the flyout menu.
 *
 * @param   {object}  entries
 *
 * @return  {void}
 */
const bodyWidth = new ResizeObserver((entries) => {
  // Update the value of 'mainHeaderWidth' with the width of the observed element
  mainHeaderWidth.value = entries[0].contentRect.width;

  // Update the value of 'isMobile' based on the current screen width
  isMobile.value = window.innerWidth < 769;

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
  bodyWidth.observe(document.body);
});

onUnmounted(() => bodyWidth.disconnect());
</script>

<style lang="scss">
@use "@styles/components/main-nav";
@use "@sass-butler/mixins" as butler-mx;

.c-main-nav {
  @include butler-mx.feature("motion") {
    /* stylelint-disable value-keyword-case */
    --gradient-primary-postion: v-bind(gradientPrimaryPostion);
    --gradient-secondary-postion: v-bind(gradientSecondaryPostion);
  }
}
</style>
