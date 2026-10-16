// @ts-ignore: Unresolved import
import Date from "@components/post/Date.vue";
import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";

describe("Date.vue", () => {
  const wrapper = mount(Date, {
    props: {
      date: "2018-09-23T15:36:00",
      lang: "en",
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

    expect(date.text()).toBe("September 23, 2018");
  });
});
