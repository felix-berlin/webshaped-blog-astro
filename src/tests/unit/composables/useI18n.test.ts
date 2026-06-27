import { useI18n } from "@/composables/useI18n";
import { currentLanguage } from "@stores/store";
import { mount } from "@vue/test-utils";
import { it, expect, describe, beforeEach } from "vitest";
import { defineComponent } from "vue";

describe("useI18n", () => {
  beforeEach(() => {
    currentLanguage.set("en");
  });

  it("returns a t function when used in a component", () => {
    const TestComponent = defineComponent({
      setup() {
        return useI18n();
      },
      template: "<div></div>",
    });
    const wrapper = mount(TestComponent);
    // t is a computed ref that gets unwrapped to a function on the component proxy
    expect(typeof wrapper.vm.t).toBe("function");
  });

  it("t translates keys for English", () => {
    currentLanguage.set("en");
    const TestComponent = defineComponent({
      setup() {
        return useI18n();
      },
      template: "<div></div>",
    });
    const wrapper = mount(TestComponent);
    const result = wrapper.vm.t("search");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("t translates keys for German", () => {
    currentLanguage.set("de");
    const TestComponent = defineComponent({
      setup() {
        return useI18n();
      },
      template: "<div></div>",
    });
    const wrapper = mount(TestComponent);
    const result = wrapper.vm.t("search");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns t in destructured form", () => {
    const TestComponent = defineComponent({
      setup() {
        const { t } = useI18n();
        return { myT: t };
      },
      template: "<div></div>",
    });
    const wrapper = mount(TestComponent);
    expect(typeof wrapper.vm.myT).toBe("function");
  });
});
