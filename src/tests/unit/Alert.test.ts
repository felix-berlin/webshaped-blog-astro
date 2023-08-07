import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import Alert from "@components/Alert.vue";

describe("Alert", () => {
  it("renders the correct type", () => {
    const wrapper = mount(Alert, {
      props: {
        type: "success",
      },
    });

    expect(wrapper.classes()).toContain("c-alert--success");
  });

  it("renders the default type if none is provided", () => {
    const wrapper = mount(Alert);

    expect(wrapper.classes()).toContain("c-alert--info");
  });

  it("renders the correct element", () => {
    const wrapper = mount(Alert, {
      props: {
        element: "span",
      },
    });

    expect(wrapper.element.tagName).toBe("SPAN");
  });

  it("renders the slot content", () => {
    const wrapper = mount(Alert, {
      slots: {
        default: "This is a test",
      },
    });

    expect(wrapper.text()).toBe("This is a test");
  });
});
