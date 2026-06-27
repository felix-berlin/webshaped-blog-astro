import Modal from "@components/Modal.vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("Modal", () => {
  beforeEach(() => {
    window.HTMLDialogElement.prototype.showModal = vi.fn();
    window.HTMLDialogElement.prototype.close = vi.fn();
  });

  afterEach(() => {
    document.body.classList.remove("u-disable-scroll");
  });

  it("renders correctly", () => {
    const wrapper = mount(Modal);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('hides close button when "showCloseButton" prop is false', () => {
    const wrapper = mount(Modal, {
      props: {
        showCloseButton: false,
      },
    });

    expect(wrapper.find(".c-modal__close").exists()).toBe(false);
  });

  it('opens the modal when "open" prop is true', async () => {
    const wrapper = mount(Modal, {
      props: {
        uid: "test",
        open: true,
      },
    });

    await wrapper.vm.$nextTick();

    // Check if the modal is visible
    expect(wrapper.vm.isVisible).toBe(true);
  });

  it('closes the modal when "open" prop is false', async () => {
    const wrapper = mount(Modal, {
      props: {
        uid: "test",
        open: false,
      },
    });

    await wrapper.vm.$nextTick();

    // Check if the modal is not visible
    expect(wrapper.vm.isVisible).toBe(false);
  });

  it("generates a unique id for the modal", () => {
    const wrapper = mount(Modal, {
      props: {
        uid: "test",
      },
    });

    // Check if the id is unique
    expect(wrapper.vm.uidHelper("modal")).toBe("modal-test");
  });

  it('prevents scroll when "disableScroll" prop is true', async () => {
    const wrapper = mount(Modal, {
      props: {
        uid: "test",
        disableScroll: true,
      },
    });

    await wrapper.vm.openModal();

    // Check if the body has the 'u-disable-scroll' class
    expect(document.body.classList.contains("u-disable-scroll")).toBe(true);
  });

  it("closes the modal when clicking outside of it", async () => {
    const wrapper = mount(Modal, {
      props: {
        uid: "test",
        closeOnClickOutside: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.openModal();

    // Simulate a click event on the modal
    await wrapper.get("dialog").trigger("click");

    // Check if the modal is not visible
    expect(wrapper.vm.isVisible).toBe(false);
  });

  it("opens the modal when open prop changes to true via watch", async () => {
    const wrapper = mount(Modal, {
      props: { uid: "test", open: false },
    });
    expect(wrapper.vm.isVisible).toBe(false);
    await wrapper.setProps({ open: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isVisible).toBe(true);
  });

  it("closes the modal when open prop changes to false via watch", async () => {
    const wrapper = mount(Modal, {
      props: { uid: "test", open: true },
    });
    expect(wrapper.vm.isVisible).toBe(true);
    await wrapper.setProps({ open: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isVisible).toBe(false);
  });

  it("removes event listeners on unmount", () => {
    const wrapper = mount(Modal, {
      props: { uid: "test", closeOnClickOutside: true },
      attachTo: document.body,
    });
    // Should not throw
    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("does not close on click when closeOnClickOutside is false", async () => {
    const wrapper = mount(Modal, {
      props: { uid: "test", closeOnClickOutside: false },
      attachTo: document.body,
    });
    await wrapper.vm.openModal();
    // Create a click event where target is the dialog itself (simulates backdrop click)
    const dialog = wrapper.find("dialog").element as HTMLDialogElement;
    const clickEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(clickEvent, "target", { value: dialog, configurable: true });
    dialog.dispatchEvent(clickEvent);
    await wrapper.vm.$nextTick();
    // Should NOT close because closeOnClickOutside is false
    expect(wrapper.vm.isVisible).toBe(true);
    wrapper.unmount();
  });

  it("removes u-disable-scroll class on close when disableScroll is true", async () => {
    const wrapper = mount(Modal, {
      props: { uid: "test", disableScroll: true },
    });
    await wrapper.vm.openModal();
    expect(document.body.classList.contains("u-disable-scroll")).toBe(true);
    await wrapper.vm.closeModal();
    expect(document.body.classList.contains("u-disable-scroll")).toBe(false);
  });

  it("emits open event when modal opens", async () => {
    const wrapper = mount(Modal, {
      props: { uid: "test" },
    });
    await wrapper.vm.openModal();
    expect(wrapper.emitted("open")).toBeTruthy();
  });

  it("emits close event when modal closes", async () => {
    const wrapper = mount(Modal, {
      props: { uid: "test" },
    });
    await wrapper.vm.closeModal();
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("does not close when click target is inside the modal (not the backdrop)", async () => {
    const wrapper = mount(Modal, {
      props: { uid: "test", closeOnClickOutside: true },
      attachTo: document.body,
      slots: { default: "<span class='inner'>content</span>" },
    });
    await wrapper.vm.openModal();
    expect(wrapper.vm.isVisible).toBe(true);
    const dialog = wrapper.find("dialog").element as HTMLDialogElement;
    const inner = wrapper.find(".inner").element as HTMLElement;
    const clickEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(clickEvent, "target", { value: inner, configurable: true });
    dialog.dispatchEvent(clickEvent);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isVisible).toBe(true);
    wrapper.unmount();
  });

  it("closes modal when native dialog close event fires", async () => {
    const wrapper = mount(Modal, {
      props: { uid: "test" },
      attachTo: document.body,
    });
    await wrapper.vm.openModal();
    expect(wrapper.vm.isVisible).toBe(true);
    const dialog = wrapper.find("dialog").element as HTMLDialogElement;
    dialog.dispatchEvent(new Event("close"));
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isVisible).toBe(false);
    wrapper.unmount();
  });
});
