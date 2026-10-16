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
      <Transition name="fade" mode="out-in">
        <MenuIcon v-if="!flyoutIsOpen" class="c-main-nav__menu-icon is-mobile" />
        <CloseIcon v-else class="c-main-nav__menu-icon is-mobile" />
      </Transition>
    </button>

    <Teleport v-if="isMobile" to="#mainHeader">
      <Transition name="fade">
        <div v-if="flyoutIsOpen" class="c-main-nav__flyout is-open">
          <MenuNav
            :menu-items="menuItems?.nodes ?? []"
            class="c-main-nav__menu is-open"
            @submenu-state="submenuIsOpen = $event"
            @menu-item-target-clicked="toggleFlyout"
          />

          <ButtonBar :lang="lang" :translations-routes="translationsRoutes" />
        </div>
      </Transition>
    </Teleport>

    <MenuNav
      v-else
      :menu-items="menuItems?.nodes ?? []"
      class="c-main-nav__menu"
      :class="{ 'is-open': submenuIsOpen }"
      @submenu-state="submenuIsOpen = $event"
    />

    <ButtonBar v-if="!isMobile" :lang="lang" :translations-routes="translationsRoutes" />
  </nav>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import Logo from "@components/Logo.vue";
import ButtonBar from "@components/main-nav/ButtonBar.vue";
import MenuNav from "@components/menu-nav/MenuNav.vue";
import MenuIcon from "virtual:icons/lucide/menu";
import CloseIcon from "virtual:icons/lucide/x";
import { ref, watch } from "vue";

import type { GetMenuByIdQuery } from "@/gql/graphql.ts";
import type { TranslationRoutes } from "@/types/i18n";

import { useBodyScrollLock } from "@/composables/useBodyScrollLock";
import { useBelowBreakpoint } from "@/composables/useBreakpoint";
import { useI18n } from "@/composables/useI18n";

export interface MainNavProps {
  lang: Lang;
  menuItems: NonNullable<GetMenuByIdQuery["menu"]>["menuItems"];
  translationsRoutes: TranslationRoutes;
}

const { lang, menuItems, translationsRoutes } = defineProps<MainNavProps>();

const isMobile = useBelowBreakpoint("sm");
const flyoutIsOpen = ref(false);
const submenuIsOpen = ref(false);
const { t } = useI18n(() => lang);

const setScrollLock = useBodyScrollLock();
watch(flyoutIsOpen, setScrollLock);

const toggleFlyout = (): void => {
  flyoutIsOpen.value = !flyoutIsOpen.value;
};

// Growing past the mobile breakpoint closes the flyout (and releases its scroll lock).
watch(isMobile, (mobile) => {
  if (!mobile) flyoutIsOpen.value = false;
});
</script>

<style lang="scss">
@use "@styles/components/main-nav";
</style>
