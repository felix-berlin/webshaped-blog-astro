<template>
  <Transition :name="transition">
    <div v-if="open" class="c-modal">
      <div ref="modalContentWrap" class="c-modal__content-wrap">
        <button
          v-if="showCloseButton"
          type="button"
          class="c-modal__close c-button"
          @click="$emit('close')"
        >
          <X />
        </button>

        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted, ref } from "vue";
import X from "virtual:icons/lucide/x";
import { onClickOutside } from "@vueuse/core";

export interface ModalProps {
  open: boolean;
  showCloseButton?: boolean;
  disableScroll?: boolean;
  closeOnClickOutside?: boolean;
  transition?: string | "slide-fade-right" | "fade";
}

const props = withDefaults(defineProps<ModalProps>(), {
  open: false,
  showCloseButton: true,
  disableScroll: false,
  closeOnClickOutside: true,
  transition: "fade",
});

const emit = defineEmits(["close", "open"]);

const modalContentWrap = ref<HTMLElement | null>(null);

onClickOutside(modalContentWrap, () => {
  if (props.closeOnClickOutside) close();
});

/**
 * Trigger close event when user clicks outside of modal
 *
 * @return  {void}
 */
const close = (): void => {
  emit("close");
};

/**
 * Close modal on escape key press
 *
 * @param   {KeyboardEvent}  event  [event description]
 *
 * @return  {void}                [return description]
 */
const closeOnEscape = (event: KeyboardEvent): void => {
  if (event.key === "Escape") {
    close();
  }
};

/**
 * Toggle disable scroll on body
 *
 * @param   {boolean}  status  yes/no
 *
 * @return  {void}
 */
const disableScroll = (status: boolean): void => {
  if (props.disableScroll && status) document.body.style.overflow = "hidden";
  if (props.disableScroll && !status) document.body.removeAttribute("style");
};

onMounted(() => {
  window.addEventListener("keyup", closeOnEscape);

  if (props.transition === "slide-right") {
    document.querySelector(".c-main-nav")?.classList.add("u-slide-parent");
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", closeOnEscape);

  if (props.transition === "slide-right") {
    document.querySelector(".c-main-nav")?.classList.remove("u-slide-parent");
  }
});

watch(
  () => props.open,
  (value) => {
    if (value) emit("open");
    disableScroll(value);
  },
);
</script>

<style lang="scss">
@use "@styles/components/modal";
</style>
