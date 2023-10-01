<template>
  <nav class="c-mobile-toc">
    <details ref="toggleButton" class="c-mobile-toc__button-wrap">
      <summary class="c-mobile-toc__button">
        <div class="c-mobile-toc__fake-button c-button">
          <span>{{ __(lang?.locale, "mobile_toc.button") }}</span>
          <ChevronRight class="c-mobile-toc__fake-button-icon" />
        </div>
        <span
          v-auto-animate
          class="c-mobile-toc__active-headline"
          v-text="activeHeadlineText"
        />
      </summary>
      <TableOfContents
        class="c-mobile-toc__dropdown"
        :headings="headings"
        html-element="div"
        toc-id="mobileTableOfContents"
        @current-headline="currentHeadline($event)"
      />
    </details>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ChevronRight from "virtual:icons/lucide/chevron-right";
import TableOfContents from "@components/post/TableOfContents.vue";
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";
import { __ } from "@i18n/i18n";
import type { TableOfContentsProps } from "@components/post/TableOfContents.vue";

interface MobileTableOfContentsProps {
  headings: TableOfContentsProps["headings"];
}

const lang = useStore(currentLanguage);

const props = defineProps<MobileTableOfContentsProps>();
const toggleButton = ref<HTMLDetailsElement | null>(null);
const activeHeadlineText = ref("");

const currentHeadline = (event: string) => (activeHeadlineText.value = event);

const closeDropdown = () => {
  if (!toggleButton.value) return;
  toggleButton.value.open = false;
};

onMounted(() => {
  activeHeadlineText.value = props.headings[0].content;

  document
    .querySelectorAll("#mobileTableOfContents .c-toc__link")
    .forEach((link) => {
      link.addEventListener("click", closeDropdown);
    });
});
</script>

<style lang="scss">
@use "@styles/components/post/mobile-toc.scss";
</style>
