<template>
  <nav v-if="pageWidth < 1024" ref="mobileToc" class="c-mobile-toc">
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
        @current-headline="currentHeadline($event)"
        @toc-link-clicked="closeDropdown"
      />
    </details>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from "vue";
import ChevronRight from "virtual:icons/lucide/chevron-right";
import TableOfContents from "@components/post/TableOfContents.vue";
import { useStore } from "@nanostores/vue";
import { windowWidth } from "@stores/store";
import { useI18n } from "@/composables/useI18n";
import type { TableOfContentsProps } from "@components/post/TableOfContents.vue";
import { onClickOutside } from "@vueuse/core";

interface MobileTableOfContentsProps {
  headings: TableOfContentsProps["headings"];
}

const { t } = useI18n();
const pageWidth = useStore(windowWidth);
const props = defineProps<MobileTableOfContentsProps>();
const toggleButton = useTemplateRef("toggleButton");
const activeHeadlineText = ref("");
const mobileToc = useTemplateRef("mobileToc");

const currentHeadline = (event: string) => (activeHeadlineText.value = event);

const closeDropdown = () => {
  if (!toggleButton.value) return;
  toggleButton.value.open = false;
};

onClickOutside(mobileToc, (): void => {
  closeDropdown();
});

onMounted(() => {
  activeHeadlineText.value = props.headings[0].content;
});
</script>

<style lang="scss">
@use "@styles/components/post/mobile-toc.scss";
</style>
