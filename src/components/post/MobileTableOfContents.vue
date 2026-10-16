<template>
  <nav v-if="isBelowDesktop" ref="mobileToc" class="c-mobile-toc">
    <details ref="toggleButton" class="c-mobile-toc__button-wrap">
      <summary class="c-mobile-toc__button">
        <div class="c-mobile-toc__fake-button c-button">
          <span v-text="t('mobile_toc.button')" />
          <ChevronRight class="c-mobile-toc__fake-button-icon" />
        </div>

        <span class="c-mobile-toc__active-headline" v-text="activeHeadlineText" />
      </summary>
      <TableOfContents
        class="c-mobile-toc__dropdown"
        :headings="headings"
        html-element="div"
        toc-id="mobileTableOfContents"
        @current-headline="activeHeadlineText = $event ?? ''"
        @toc-link-clicked="closeDropdown"
      />
    </details>
  </nav>
</template>

<script setup lang="ts">
import type { TableOfContentsProps } from "@components/post/TableOfContents.vue";
import type { Lang } from "@i18n/ui";

import TableOfContents from "@components/post/TableOfContents.vue";
import { onClickOutside } from "@vueuse/core";
import ChevronRight from "virtual:icons/lucide/chevron-right";
import { ref, useTemplateRef } from "vue";

import { useBelowBreakpoint } from "@/composables/useBreakpoint";
import { useI18n } from "@/composables/useI18n";

interface MobileTableOfContentsProps {
  headings: TableOfContentsProps["headings"];
  lang: Lang;
}

const { headings, lang } = defineProps<MobileTableOfContentsProps>();
const { t } = useI18n(() => lang);

// The sidebar TOC takes over from the md breakpoint (see BlogPost.astro's client:media).
const isBelowDesktop = useBelowBreakpoint("md");
const toggleButton = useTemplateRef("toggleButton");
const mobileToc = useTemplateRef("mobileToc");
const activeHeadlineText = ref(headings[0]?.content ?? "");

const closeDropdown = () => {
  if (!toggleButton.value) return;
  toggleButton.value.open = false;
};

onClickOutside(mobileToc, closeDropdown);
</script>

<style lang="scss">
@use "@styles/components/post/mobile-toc.scss";
</style>
