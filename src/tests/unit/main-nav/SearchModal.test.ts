import SearchModal from "@components/main-nav/SearchModal.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe, vi, beforeEach } from "vitest";

vi.mock("@pagefind/default-ui", () => ({
  PagefindUI: vi.fn(),
}));

beforeEach(() => {
  window.HTMLDialogElement.prototype.showModal = vi.fn();
  window.HTMLDialogElement.prototype.close = vi.fn();
});

const isOpen = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent({ name: "Modal" }).props("open");

describe("SearchModal.vue", () => {
  it("renders the search button and a closed modal", () => {
    const wrapper = mount(SearchModal, { props: { lang: "de" } });
    expect(wrapper.find("button.c-searchbar").exists()).toBe(true);
    expect(isOpen(wrapper)).toBe(false);
  });

  it("loads the Search component only once the search is opened", async () => {
    const wrapper = mount(SearchModal, { props: { lang: "de" } });
    expect(wrapper.findComponent({ name: "Search" }).exists()).toBe(false);

    await wrapper.find("button.c-searchbar").trigger("click");
    await vi.waitFor(() => expect(wrapper.findComponent({ name: "Search" }).exists()).toBe(true));
    expect(isOpen(wrapper)).toBe(true);
  });

  it("closes when the modal emits close", async () => {
    const wrapper = mount(SearchModal, { props: { lang: "de" } });
    await wrapper.find("button.c-searchbar").trigger("click");
    await wrapper.findComponent({ name: "Modal" }).vm.$emit("close");
    expect(isOpen(wrapper)).toBe(false);
  });

  it.each(["/", "."])("opens on the %s shortcut", async (key) => {
    const wrapper = mount(SearchModal, { props: { lang: "de" }, attachTo: document.body });
    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
    await wrapper.vm.$nextTick();
    expect(isOpen(wrapper)).toBe(true);
    wrapper.unmount();
  });

  it("ignores the shortcut while typing and for other keys", async () => {
    const wrapper = mount(SearchModal, { props: { lang: "de" }, attachTo: document.body });
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
    await wrapper.vm.$nextTick();

    expect(isOpen(wrapper)).toBe(false);
    input.remove();
    wrapper.unmount();
  });

  it("removes the shortcut listener on unmount", async () => {
    const wrapper = mount(SearchModal, { props: { lang: "de" } });
    const modal = wrapper.findComponent({ name: "Modal" });
    wrapper.unmount();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
    expect(modal.props("open")).toBe(false);
  });
});
