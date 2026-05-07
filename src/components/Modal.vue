<template>
  <dialog
    :id="uidHelper('modal')"
    ref="modal"
    class="c-modal"
    :class="[`c-modal--${position}`]"
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
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";
import { useTranslations } from "@utils/i18n/utils";
import X from "virtual:icons/lucide/x";
import { onMounted, onUnmounted, ref, watch } from "vue";

export interface ModalProps {
  closeOnClickOutside?: boolean;
  disableScroll?: boolean;
  open?: boolean;
  position?: "bottom" | "center" | "top";
  showCloseButton?: boolean;
  transition?: "fade" | "slide-fade-right" | string;
  uid: string;
}

const {
  closeOnClickOutside = true,
  disableScroll = false,
  open = false,
  position = "center",
  showCloseButton = true,
  uid,
} = defineProps<ModalProps>();

const modal = ref<HTMLDialogElement | null>(null);
const emit = defineEmits(["close", "open"]);
const isVisible = ref(open);
const lang = useStore(currentLanguage);
const t = useTranslations(lang.value);
/**
 * Open the modal
 *
 * @return  {void}
 */
const openModal = (): void => {
  modal?.value?.showModal();
  isVisible.value = true;
  emit("open");
  preventScroll(true);
};

/**
 * Close the modal
 *
 * @return  {void}
 */
const closeModal = (): void => {
  modal?.value?.close();
  isVisible.value = false;
  emit("close");
  preventScroll(false);
};

/**
 * Generate a unique id for the modal
 *
 * @param   {string}  id  Name of the HTML ID
 *
 * @return  {string}      Unique ID
 */
const uidHelper = (id: string): string => {
  return `${id}-${uid}`;
};

/**
 * Toggle disable scroll on body
 *
 * @param   {boolean}  status  yes/no
 *
 * @return  {void}
 */
const preventScroll = (status: boolean): void => {
  if (disableScroll && status) document.body.classList.add("u-disable-scroll");
  if (disableScroll && !status) document.body.classList.remove("u-disable-scroll");
};

/**
 * Close the modal when clicking outside of it
 *
 * @param   {MouseEvent}  event  Click event
 *
 * @return  {void}
 */
const onClickOutside = (event: MouseEvent): void => {
  if (event.target === modal.value) closeModal();
};

onMounted(() => {
  if (closeOnClickOutside) modal.value?.addEventListener("click", onClickOutside);

  modal.value?.addEventListener("close", () => closeModal());
});

onUnmounted(() => {
  if (closeOnClickOutside) modal.value?.removeEventListener("click", onClickOutside);

  modal.value?.removeEventListener("close", () => closeModal());
});

watch(
  () => open,
  (value) => {
    if (value) openModal();
    if (!value) closeModal();
  },
);
</script>

<style lang="scss">
@use "@styles/components/modal";
</style>
