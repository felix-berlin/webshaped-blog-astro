// @ts-ignore: Unresolved import
import RssLink from "@components/RssLink.vue";
import { currentLanguage } from "@stores/store";
import { mount } from "@vue/test-utils";
import { it, expect, describe, beforeEach } from "vitest";

describe("RssLink.vue", () => {
  beforeEach(() => {
    currentLanguage.set("en");
  });

  it("renders the link element", () => {
    const wrapper = mount(RssLink);
    expect(wrapper.find("a").exists()).toBe(true);
  });

  it("links to the correct RSS feed URL for current language", () => {
    currentLanguage.set("en");
    const wrapper = mount(RssLink);
    expect(wrapper.find("a").attributes("href")).toBe("/en/rss.xml");
  });

  it("links to the German RSS feed when language is de", () => {
    currentLanguage.set("de");
    const wrapper = mount(RssLink);
    expect(wrapper.find("a").attributes("href")).toBe("/de/rss.xml");
  });

  it("opens link in new tab", () => {
    const wrapper = mount(RssLink);
    expect(wrapper.find("a").attributes("target")).toBe("_blank");
  });

  it("has an aria-label attribute", () => {
    const wrapper = mount(RssLink);
    const ariaLabel = wrapper.find("a").attributes("aria-label");
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel!.length).toBeGreaterThan(0);
  });

  it("renders slotted content", () => {
    const wrapper = mount(RssLink, {
      slots: {
        default: "<span class='custom-content'>RSS</span>",
      },
    });
    expect(wrapper.find(".custom-content").exists()).toBe(true);
  });
});
