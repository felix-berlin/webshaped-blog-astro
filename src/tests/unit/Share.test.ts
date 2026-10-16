import Share from "@components/Share.vue";
import { mount } from "@vue/test-utils";
import Share2 from "virtual:icons/lucide/share-2";
import { test, expect, describe, vi, beforeEach } from "vitest";

const shareMock = vi.fn();

vi.mock("@vueuse/core", () => ({
  useShare: () => ({ isSupported: true, share: shareMock }),
}));

beforeEach(() => shareMock.mockClear());

describe("Share.vue", () => {
  test("shares the given title, text and url", async () => {
    const wrapper = mount(Share, {
      props: { title: "Test Title", text: "Test Text", url: "https://example.com", lang: "en" },
    });
    await wrapper.find("button").trigger("click");
    expect(shareMock).toHaveBeenCalledWith({
      title: "Test Title",
      text: "Test Text",
      url: "https://example.com",
    });
  });

  test("falls back to the current page URL", async () => {
    const wrapper = mount(Share, { props: { title: "Test Title", lang: "de" } });
    await wrapper.find("button").trigger("click");
    expect(shareMock).toHaveBeenCalledWith(expect.objectContaining({ url: window.location.href }));
  });

  test("renders Share2 component when showButton is true", () => {
    const wrapper = mount(Share, { props: { lang: "de" } });
    expect(wrapper.findComponent(Share2).exists()).toBe(true);
  });

  test("does not render Share2 component when showButton is false", () => {
    const wrapper = mount(Share, { props: { showButton: false, lang: "de" } });
    expect(wrapper.findComponent(Share2).exists()).toBe(false);
  });
});
