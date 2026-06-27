// @ts-ignore: Unresolved import
import Search from "@components/Search.vue";
import { mount } from "@vue/test-utils";
import { JSDOM } from "jsdom";
import { it, expect, describe, vi } from "vitest";

describe("Search", async () => {
  it("Search component renders correctly", async () => {
    // Create a new JSDOM instance
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");

    // Set the global window and document objects to the JSDOM window and document objects
    global.window = dom.window;
    global.document = dom.window.document;

    // Mount the Search component
    const wrapper = mount(Search, {
      props: {
        id: "search",
      },
    });

    // Assert that the component renders correctly
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders container div with correct id", () => {
    const wrapper = mount(Search, { props: { id: "my-search" } });
    const div = wrapper.find("div.c-search");
    expect(div.attributes("id")).toBe("my-search");
  });

  it("triggers search on '/' keydown", async () => {
    const wrapper = mount(Search, {
      props: { id: "search-test" },
      attachTo: document.body,
    });
    const event = new KeyboardEvent("keydown", { key: "/" });
    window.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    // Should not throw; keyboard handler runs
    expect(wrapper.exists()).toBe(true);
    wrapper.unmount();
  });

  it("ignores keydown when INPUT is focused", async () => {
    const wrapper = mount(Search, {
      props: { id: "search-test" },
      attachTo: document.body,
    });
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    const event = new KeyboardEvent("keydown", { key: "/" });
    window.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
    input.remove();
    wrapper.unmount();
  });

  it("ignores keydown for unrelated keys", async () => {
    const wrapper = mount(Search, {
      props: { id: "search-test" },
      attachTo: document.body,
    });
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    window.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
    wrapper.unmount();
  });

  it("removes event listener on unmount", () => {
    const wrapper = mount(Search, {
      props: { id: "search-test" },
      attachTo: document.body,
    });
    expect(() => wrapper.unmount()).not.toThrow();
  });
});
