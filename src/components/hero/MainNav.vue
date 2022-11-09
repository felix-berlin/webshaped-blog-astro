<template>
  <nav class="c-main-nav">
    <a
      href="/"
      class="c-main-nav__logo-link"
    >
      <img
        class="c-main-nav__logo"
        src="https://cms.webshaped.de/wp-content/uploads/webshaped_logo_2018_rbg_light.svg"
        alt="Logo"
        width="125"
        height="40"
      >
    </a>

    <!-- <LanguageSelect /> -->

    <button
      type="button"
      class="c-main-nav__toggle c-button c-button--icon"
      @click="toggleFlyout"
    >
      <MenuIcon
        :menu-items="props.menuItems"
        class="c-main-nav__menu-icon is-mobile"
      />
    </button>

    <Transition
      name="fade"
    >
      <div
        v-show="isOpen"
        class="c-main-nav__flyout"
      >
        <Menu
          :menu-items="props.menuItems"
          class="c-main-nav__menu"
          :class="{'is-open': isOpen}"
        />
        <ColorModeToggle />
      </div>
    </Transition>



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
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Menu from '@components/Menu.vue';
import ColorModeToggle from '@components/ColorModeToggle.vue';
import LanguageSelect from '@components/LanguageSelect.vue';
import Modal from '@components/Modal.vue';
import { Menu as MenuIcon, X } from 'lucide-vue-next';

export interface MainNavProps {
  menuItems: {
    nodes: [
      {
        label: string,
        order: number;
        path: string;
        childItems: {
          nodes: [
            {
              label: string;
              order: number;
              path: string;
            }
          ]
        }
      }
    ]
  };
}

const props = defineProps<MainNavProps>()

const isOpen = ref(false);

const mainHeaderWidth = ref(0);

/**
 * Toggle the flyout menu
 *
 * @return  {void}
 */
const toggleFlyout = (): void => {
  isOpen.value = !isOpen.value;
}

/**
 * Observe the body with
 *
 * @param   {object}  entries
 *
 * @return  {void}
 */
const bodyWidth = new ResizeObserver(entries => {
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
  if (status) document.body.style.overflow = 'hidden';
  if (!status) document.body.removeAttribute('style');
};

watch(() => isOpen.value, (value) => {
  controlScroll(value);
});

onMounted(() => bodyWidth.observe(document.body));

onUnmounted(() => bodyWidth.disconnect());
</script>

<style lang="scss">
@use '@styles/components/main-nav';
</style>
