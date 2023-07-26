<template>
  <nav ref="mainNav" class="c-main-nav">
    <Logo />

    <!-- <LanguageSelect /> -->

    <button
      type="button"
      class="c-main-nav__toggle c-button c-button--icon"
      :aria-label="__(lang.locale!, 'main_nav.toggle_button.label')"
      :aria-expanded="isOpen"
      @click="toggleFlyout"
    >
      <MenuIcon
        :menu-items="props.menuItems"
        class="c-main-nav__menu-icon is-mobile"
      />
    </button>

    <Transition name="fade">
      <div v-show="isOpen" class="c-main-nav__flyout">
        <Menu
          :menu-items="props.menuItems"
          class="c-main-nav__menu c-menu--header"
          :class="{ 'is-open': isOpen }"
        />
        <ColorModeToggle />
      </div>
    </Transition>

    <MenuNav :menu-items="props.menuItems.nodes" />
    <!-- <Modal
      :open="isOpen"
      transition="slide-fade-right"
      @close="isOpen = !isOpen"
    >
      <Menu
        :menu-items="props.menuItems"
        class="is-mobile"
      />

      <LanguageSelect />
      <ColorModeToggle />
    </Modal> -->
  </nav>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import Menu from "@components/Menu.vue";
import ColorModeToggle from "@components/ColorModeToggle.vue";
import LanguageSelect from "@components/LanguageSelect.vue";
import Modal from "@components/Modal.vue";
import Logo from "@components/Logo.vue";
import { Menu as MenuIcon, X } from "lucide-vue-next";
import { useMouseInElement } from "@vueuse/core";
import { __ } from "@i18n/i18n";
import MenuNav from "@components/menu-nav/MenuNav.vue";
import type { Language, MenuToMenuItemConnection } from "../../types/generated/graphql";

export interface MainNavProps {
  menuItems: MenuToMenuItemConnection;
  lang: Language;
}

const props = defineProps<MainNavProps>();

const isOpen = ref(false);
const mainHeaderWidth = ref(0);
const mainNav = ref(null);

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
  isOpen.value = !isOpen.value;
};

/**
 * Observe the body with
 *
 * @param   {object}  entries
 *
 * @return  {void}
 */
const bodyWidth = new ResizeObserver((entries) => {
  mainHeaderWidth.value = entries[0].contentRect.width;

  if (entries[0].contentRect.width > 767 && isOpen.value) {
    controlScroll(false);
  }
  if (entries[0].contentRect.width < 767 && isOpen.value) {
    controlScroll(true);
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

watch(
  () => isOpen.value,
  (value) => {
    controlScroll(value);
  }
);

/**
 * Observes the width of the body element using the ResizeObserver API.
 * Disables or enables scroll on the body element based on the width and the state of the flyout menu.
 */
onMounted(() => {
  bodyWidth.observe(document.body)
  console.log(props.menuItems);

});

onUnmounted(() => bodyWidth.disconnect());
</script>

<style lang="scss">
@use "@styles/components/main-nav";
@use "@sass-butler/mixins" as butler-mx;

.c-main-nav {
  @include butler-mx.feature("motion") {
    --gradient-primary-postion: v-bind(gradientPrimaryPostion);
    --gradient-secondary-postion: v-bind(gradientSecondaryPostion);
  }
}
</style>
