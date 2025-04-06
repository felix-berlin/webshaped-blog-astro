import { mount, flushPromises } from "@vue/test-utils";
import { JSDOM } from "jsdom";
import { test, expect, describe, vi, beforeAll, afterAll } from "vitest";
// @ts-ignore: Unresolved import
import Share from "@components/Share.vue";
import { nextTick } from "vue";
import Share2 from "virtual:icons/lucide/share-2";

const shareMock = vi.fn().mockResolvedValue({ state: "granted" });
const permissionsMock = { query: shareMock };
const originalPermissions = navigator.permissions;

vi.mock("@vueuse/core", () => ({
  useShare: () => ({
    isSupported: true, // Mock isSupported to always be true
    share: shareMock, // Use shareMock here
  }),
}));

beforeAll(() => {
  Object.defineProperty(global.navigator, "share", {
    value: shareMock,
    writable: true,
  });

  Object.defineProperty(navigator, "permissions", {
    value: permissionsMock,
    writable: true,
  });
});

afterAll(() => {
  global.navigator.share = vi.fn();
  Object.defineProperty(navigator, "permissions", {
    value: originalPermissions,
    writable: true,
  });
});

describe("Share.vue", () => {
  test("clicking the button calls the share function", async () => {
    const { window } = new JSDOM("<!DOCTYPE html>");
    global.window = window;
    global.document = window.document;
    global.navigator = window.navigator;
    window.navigator.share = shareMock;

    const wrapper = mount(Share, {
      props: {
        title: "Test Title",
        text: "Test Text",
        url: "https://example.com",
        lang: {
          locale: "en_US",
          id: "en",
        },
      },
    });

    // Assuming that wrapper and shareMock are defined and initialized properly
    await wrapper.find("button").trigger("click");

    expect(shareMock).toHaveBeenCalledWith({
      title: "Test Title",
      text: "Test Text",
      url: "https://example.com",
    });
  });

  test("it sets currentUrl to window.location.href if props.url is not provided", async () => {
    // Create a new JSDOM instance with the desired URL
    const jsdom = new JSDOM("", { url: "https://example.com" });

    // Replace the global window object with the window object from the JSDOM instance
    global.window = jsdom.window;

    // Mount the component without providing props.url
    const wrapper = mount(Share, {
      props: {
        title: "Test Title",
        text: "Test Text",
        // Don't provide url
      },
    });

    // Wait for any asynchronous updates to complete
    await nextTick();

    // Now check if currentUrl was set to window.location.href
    expect(wrapper.vm.currentUrl).toBe("https://example.com/");

    // Restore the original window object after the test
    global.window = jsdom.window.parent;
  });

  test("renders Share2 component when showButton is true", () => {
    const wrapper = mount(Share, {
      props: {
        showButton: true,
      },
    });

    expect(wrapper.findComponent(Share2).exists()).toBe(true);
  });
});
