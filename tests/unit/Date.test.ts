import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import Date from "@components/post/Date.vue";

describe("Date.vue", () => {
  const wrapper = mount(Date, {
    props: {
      date: "2018-09-23 15:36:00",
    },
  });

  test("Is component visible?", () => {
    const categoryList = wrapper.find(".c-date");
    expect(categoryList.exists()).toBe(true);
  });

  test("Check for right date format", () => {
    const categoryList = wrapper.find(".c-date").text();
    expect(/T/g.test(categoryList)).toBe(false);
  });

  test("Check for valid Date", () => {
    const date = wrapper.find(".c-date");

    expect(date.text()).toBe("23. September 2018");
  });
});
