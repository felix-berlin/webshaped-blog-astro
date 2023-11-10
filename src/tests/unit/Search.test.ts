import { mount } from "@vue/test-utils";
import { JSDOM } from "jsdom";
import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import Search from "@components/Search.vue";

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
});
