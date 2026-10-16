<template>
  <dialog
    :id="`modal-${uid}`"
    ref="modal"
    class="c-modal"
    :class="[`c-modal--${position}`]"
    @click="onClick"
    @close="onClosed"
  >
    <button
      v-if="showCloseButton"
      class="c-modal__close c-button c-button--icon"
      type="submit"
      :aria-label="t('close')"
      @click="closeModal"
    >
      <X />
    </button>

    <slot />
  </dialog>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import X from "virtual:icons/lucide/x";
import { useTemplateRef, watch } from "vue";

import { useBodyScrollLock } from "@/composables/useBodyScrollLock";
import { useI18n } from "@/composables/useI18n";

export interface ModalProps {
  closeOnClickOutside?: boolean;
  disableScroll?: boolean;
  lang: Lang;
  open?: boolean;
  position?: "bottom" | "center" | "top";
  showCloseButton?: boolean;
  uid: string;
}

const {
  closeOnClickOutside = true,
  disableScroll = false,
  lang,
  open = false,
  position = "center",
  showCloseButton = true,
  uid,
} = defineProps<ModalProps>();
const emit = defineEmits<{ close: []; open: [] }>();
const { t } = useI18n(() => lang);

const modal = useTemplateRef<HTMLDialogElement>("modal");

const setScrollLock = useBodyScrollLock();
const lockScroll = (locked: boolean): void => {
  if (disableScroll) setScrollLock(locked);
};

const openModal = (): void => {
  modal.value?.showModal();
  lockScroll(true);
  emit("open");
};

// Every way of closing (button, backdrop, Esc, `open` prop) ends in the native
// "close" event, so `onClosed` is the single place that cleans up and emits.
const closeModal = (): void => modal.value?.close();

const onClosed = (): void => {
  lockScroll(false);
  emit("close");
};

// A click whose target is the <dialog> itself landed on the backdrop.
const onClick = (event: MouseEvent): void => {
  if (closeOnClickOutside && event.target === modal.value) closeModal();
};

watch(
  () => open,
  (value) => (value ? openModal() : closeModal()),
);
</script>

<style lang="scss">
@use "@styles/components/modal";
</style>
