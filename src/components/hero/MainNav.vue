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

    <button
      type="button"
      class="c-button c-main-nav__toggle"
      @click="isOpen = !isOpen"
    >
      <MenuIcon
        :menu-items="props.menuItems"
        class="is-mobile"
      />
    </button>

    <Transition
      name="fade"
    >
      <Menu
        v-show="isOpen"
        :menu-items="props.menuItems"
        class="c-main-nav__menu"
        :class="{'is-open': isOpen}"
      />
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
import { ref, watch } from 'vue';
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

/**
 * Toggle disable scroll on body
 *
 * @param   {boolean}  status  yes/no
 *
 * @return  {void}
 */
const disableScroll = (status: boolean): void => {
  if (status) document.body.style.overflow = 'hidden';
  if (!status) document.body.removeAttribute('style');
};

watch(() => isOpen.value, (value) => {
  disableScroll(value);
});
</script>

<style lang="scss">
@use '@styles/components/main-nav';
</style>
