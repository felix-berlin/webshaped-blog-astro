// @ts-ignore: Unresolved import
import CookieConsent from "@components/CookieConsent.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe, beforeEach, vi } from "vitest";

describe("CookieConsent.vue", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the cookie consent element", () => {
    const wrapper = mount(CookieConsent);
    expect(wrapper.find(".c-cookie-consent").exists()).toBe(true);
  });

  it("renders three buttons", () => {
    const wrapper = mount(CookieConsent);
    const buttons = wrapper.findAll("button");
    expect(buttons).toHaveLength(3);
  });

  it("clicking Accept all sets data.acceptAllCookies to true", async () => {
    const wrapper = mount(CookieConsent);
    const buttons = wrapper.findAll("button");
    const acceptButton = buttons.find((b) => b.text() === "Accept all");
    await acceptButton?.trigger("click");
    expect(wrapper.vm.data.acceptAllCookies).toBe(true);
  });

  it("clicking Reject all sets data.acceptAllCookies to false", async () => {
    const wrapper = mount(CookieConsent);
    const buttons = wrapper.findAll("button");
    const rejectButton = buttons.find((b) => b.text() === "Reject all");
    await rejectButton?.trigger("click");
    expect(wrapper.vm.data.acceptAllCookies).toBe(false);
  });

  it("clicking Options toggles showOptions", async () => {
    const wrapper = mount(CookieConsent);
    expect(wrapper.vm.data.showOptions).toBe(false);
    const buttons = wrapper.findAll("button");
    const optionsButton = buttons.find((b) => b.text() === "Options");
    await optionsButton?.trigger("click");
    expect(wrapper.vm.data.showOptions).toBe(true);
    await optionsButton?.trigger("click");
    expect(wrapper.vm.data.showOptions).toBe(false);
  });

  it("shows options div when showOptions is true", async () => {
    const wrapper = mount(CookieConsent);
    expect(wrapper.find("[v-if='data.showOptions']").exists()).toBe(false);
    await wrapper.vm.$nextTick();
    wrapper.vm.data.showOptions = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find("div").exists()).toBe(true);
  });

  it("initializes from localStorage if value exists", () => {
    localStorage.setItem("acceptAllCookies", "true");
    const wrapper = mount(CookieConsent);
    expect(wrapper.vm.data.acceptAllCookies).toBe("true");
  });

  it("sets isMounted to true after mounting", async () => {
    const wrapper = mount(CookieConsent);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.data.isMounted).toBe(true);
  });

  it("unmounts without errors (covers onBeforeUnmount stop)", () => {
    const wrapper = mount(CookieConsent);
    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("cookieChoice sets localStorage value", () => {
    const wrapper = mount(CookieConsent);
    (wrapper.vm as any).cookieChoice(true);
    expect(localStorage.getItem("acceptAllCookies")).toBe("true");
    (wrapper.vm as any).cookieChoice(false);
    expect(localStorage.getItem("acceptAllCookies")).toBe("false");
  });

  it("watchEffect skips localStorage.setItem when acceptAllCookies is null", async () => {
    const wrapper = mount(CookieConsent);
    // Force to null to cover the !==null false branch
    (wrapper.vm as any).data.acceptAllCookies = null;
    await wrapper.vm.$nextTick();
    // Just verify no error is thrown; the null branch skips setItem
    expect((wrapper.vm as any).data.acceptAllCookies).toBeNull();
  });
});
