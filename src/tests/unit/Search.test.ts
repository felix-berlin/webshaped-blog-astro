import Search from "@components/Search.vue";
import { PagefindUI } from "@pagefind/default-ui";
import { mount } from "@vue/test-utils";
import { it, expect, describe, vi, beforeEach } from "vitest";

vi.mock("@pagefind/default-ui", () => ({
  PagefindUI: vi.fn(function (options?: { element: string }) {
    if (options) document.querySelector(options.element)?.append(document.createElement("input"));
  }),
}));

beforeEach(() => vi.mocked(PagefindUI).mockClear());

describe("Search", () => {
  it("renders the container with the given id", () => {
    const wrapper = mount(Search, { props: { id: "my-search" } });
    expect(wrapper.find("div.c-search").attributes("id")).toBe("my-search");
  });

  it("initialises Pagefind on that container", () => {
    mount(Search, { props: { id: "my-search" }, attachTo: document.body });
    expect(PagefindUI).toHaveBeenCalledWith(
      expect.objectContaining({ element: "#my-search", resetStyles: false, showImages: false }),
    );
  });

  it("focuses the search input when autofocus is set", () => {
    const wrapper = mount(Search, {
      props: { id: "focus-search", autofocus: true },
      attachTo: document.body,
    });
    expect(document.activeElement).toBe(wrapper.find("input").element);
    wrapper.unmount();
  });
});
