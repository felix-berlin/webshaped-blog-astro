import Modal from "@components/Modal.vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// jsdom has no real <dialog>: open/close toggle the attribute, and close() fires the
// native "close" event like browsers do.
beforeEach(() => {
  window.HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  });
  window.HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  });
});

afterEach(() => {
  document.body.classList.remove("u-disable-scroll");
});

const mountModal = (props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) =>
  mount(Modal, { props: { lang: "de", uid: "test", ...props }, ...options });

describe("Modal", () => {
  it("renders correctly", () => {
    expect(mountModal().html()).toMatchSnapshot();
  });

  it("derives the dialog id from uid", () => {
    expect(mountModal().find("dialog").attributes("id")).toBe("modal-test");
  });

  it('hides close button when "showCloseButton" prop is false', () => {
    expect(mountModal({ showCloseButton: false }).find(".c-modal__close").exists()).toBe(false);
  });

  it("opens and closes when the open prop changes", async () => {
    const wrapper = mountModal();
    await wrapper.setProps({ open: true });
    expect(wrapper.find("dialog").attributes("open")).toBeDefined();
    expect(wrapper.emitted("open")).toHaveLength(1);

    await wrapper.setProps({ open: false });
    expect(wrapper.find("dialog").attributes("open")).toBeUndefined();
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("emits close exactly once per close", async () => {
    const wrapper = mountModal();
    await wrapper.setProps({ open: true });
    await wrapper.find(".c-modal__close").trigger("click");
    await wrapper.setProps({ open: false });
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("locks body scroll while open when disableScroll is set", async () => {
    const wrapper = mountModal({ disableScroll: true });
    await wrapper.setProps({ open: true });
    expect(document.body.classList.contains("u-disable-scroll")).toBe(true);
    await wrapper.setProps({ open: false });
    expect(document.body.classList.contains("u-disable-scroll")).toBe(false);
  });

  it("closes on a backdrop click but not on a click inside", async () => {
    const wrapper = mountModal({}, { slots: { default: "<span class='inner'>content</span>" } });
    await wrapper.setProps({ open: true });

    await wrapper.find(".inner").trigger("click");
    expect(wrapper.emitted("close")).toBeUndefined();

    await wrapper.find("dialog").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("ignores backdrop clicks when closeOnClickOutside is false", async () => {
    const wrapper = mountModal({ closeOnClickOutside: false });
    await wrapper.setProps({ open: true });
    await wrapper.find("dialog").trigger("click");
    expect(wrapper.emitted("close")).toBeUndefined();
  });

  it("cleans up when the browser closes the dialog (Esc)", async () => {
    const wrapper = mountModal({ disableScroll: true });
    await wrapper.setProps({ open: true });
    (wrapper.find("dialog").element as HTMLDialogElement).close();
    expect(wrapper.emitted("close")).toHaveLength(1);
    expect(document.body.classList.contains("u-disable-scroll")).toBe(false);
  });
});
