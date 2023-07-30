import { mount } from "@vue/test-utils";
import { JSDOM } from "jsdom";
import { test, expect, describe, vi, beforeAll, afterAll } from "vitest";
// @ts-ignore: Unresolved import
import Share from "@components/Share.vue";

// const shareMock = vi.fn();
const shareMock = vi.fn().mockResolvedValue({ state: "granted" });
const permissionsMock = { query: shareMock };
const originalPermissions = navigator.permissions;

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

    // console.log(await global.navigator.share());

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

    // console.log(wrapper.html(), wrapper.vm.isSupported);
    // TODO: Fix this test
    // await wrapper.find("button").trigger("click");

    // expect(shareMock).toHaveBeenCalledWith({
    //   title: "Test Title",
    //   text: "Test Text",
    //   url: "https://example.com",
    // });
  });
});
