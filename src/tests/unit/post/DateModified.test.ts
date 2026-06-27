// @ts-ignore: Unresolved import
import DateModified from "@components/post/DateModified.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("DateModified.vue", () => {
  const wrapper = mount(DateModified, {
    props: {
      date: "2023-06-15T10:00:00",
      lang: "en_US",
    },
  });

  it("renders the component", () => {
    expect(wrapper.find(".c-date-modified").exists()).toBe(true);
  });

  it("displays the last_updated headline", () => {
    const headline = wrapper.find(".c-date-modified__headline");
    expect(headline.exists()).toBe(true);
    expect(headline.text().length).toBeGreaterThan(0);
  });

  it("renders the date sub-component", () => {
    expect(wrapper.find(".c-date-modified__date").exists()).toBe(true);
  });

  it("renders with German locale", () => {
    const deWrapper = mount(DateModified, {
      props: {
        date: "2023-06-15T10:00:00",
        lang: "de_DE",
      },
    });
    expect(deWrapper.find(".c-date-modified").exists()).toBe(true);
  });
});
