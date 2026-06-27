// @ts-ignore: Unresolved import
import SearchModal from "@components/main-nav/SearchModal.vue";
import { mount, flushPromises } from "@vue/test-utils";
import { it, expect, describe, vi, beforeEach } from "vitest";
import { nextTick } from "vue";

vi.mock("@pagefind/default-ui", () => ({
  PagefindUI: vi.fn(),
}));

beforeEach(() => {
  window.HTMLDialogElement.prototype.showModal = vi.fn();
  window.HTMLDialogElement.prototype.close = vi.fn();
});

describe("SearchModal.vue", () => {
  it("renders the search button", () => {
    const wrapper = mount(SearchModal);
    expect(wrapper.find("button.c-searchbar").exists()).toBe(true);
  });

  it("renders Modal component", () => {
    const wrapper = mount(SearchModal);
    expect(wrapper.findComponent({ name: "Modal" }).exists()).toBe(true);
  });

  it("renders Search component inside modal", () => {
    const wrapper = mount(SearchModal);
    expect(wrapper.findComponent({ name: "Search" }).exists()).toBe(true);
  });

  it("opens search when button is clicked", async () => {
    const wrapper = mount(SearchModal);
    expect(wrapper.vm.searchVisible).toBe(false);
    await wrapper.find("button.c-searchbar").trigger("click");
    expect(wrapper.vm.searchVisible).toBe(true);
  });

  it("closes search when modal emits close", async () => {
    const wrapper = mount(SearchModal);
    wrapper.vm.searchVisible = true;
    await wrapper.vm.$nextTick();
    const modal = wrapper.findComponent({ name: "Modal" });
    await modal.vm.$emit("close");
    expect(wrapper.vm.searchVisible).toBe(false);
  });

  it("opens search on '/' keydown", async () => {
    const wrapper = mount(SearchModal, { attachTo: document.body });
    expect(wrapper.vm.searchVisible).toBe(false);
    const event = new KeyboardEvent("keydown", { key: "/" });
    window.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.searchVisible).toBe(true);
    wrapper.unmount();
  });

  it("opens search on '.' keydown", async () => {
    const wrapper = mount(SearchModal, { attachTo: document.body });
    wrapper.vm.searchVisible = false;
    const event = new KeyboardEvent("keydown", { key: "." });
    window.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.searchVisible).toBe(true);
    wrapper.unmount();
  });

  it("does not open search when INPUT is focused on keydown", async () => {
    const wrapper = mount(SearchModal, { attachTo: document.body });
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    const event = new KeyboardEvent("keydown", { key: "/" });
    window.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.searchVisible).toBe(false);
    input.remove();
    wrapper.unmount();
  });

  it("does not open search for other keys", async () => {
    const wrapper = mount(SearchModal, { attachTo: document.body });
    const event = new KeyboardEvent("keydown", { key: "a" });
    window.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.searchVisible).toBe(false);
    wrapper.unmount();
  });

  it("cleans up event listener on unmount", () => {
    const wrapper = mount(SearchModal, { attachTo: document.body });
    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("focusSearch nextTick callback runs after opening search", async () => {
    const input = document.createElement("input");
    input.id = "main-search-input";
    document.body.appendChild(input);
    const wrapper = mount(SearchModal, { attachTo: document.body });
    await wrapper.find("button.c-searchbar").trigger("click");
    await nextTick();
    await flushPromises();
    expect(wrapper.vm.searchVisible).toBe(true);
    input.remove();
    wrapper.unmount();
  });
});
