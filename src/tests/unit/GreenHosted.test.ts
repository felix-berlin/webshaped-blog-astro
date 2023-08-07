import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import { Leaf } from "lucide-vue-next";
// @ts-ignore: Unresolved import
import GreenHosted from "@components/footer/GreenHosted.vue";

describe("GreenHosted.vue", () => {
  test("GreenHosted component renders correctly", () => {
    const wrapper = mount(GreenHosted, {
      props: {
        lang: {
          locale: "en_US",
          id: "en",
        },
      },
    });

    expect(wrapper.find(".c-green-hosted__link").exists()).toBe(true);
    expect(wrapper.findComponent(Leaf).exists()).toBe(true);
    expect(wrapper.find("span").text()).toBe("CO2 neutral hosted");
  });
});
