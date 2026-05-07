// @ts-ignore: Unresolved import
import ReadingTime from "@components/post/ReadingTime.vue";
import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";

test("Viewing the reading time text", () => {
  const wrapper = mount(ReadingTime, {
    props: {
      time: 12,
      lang: "en",
    },
  });

  const time = wrapper.find(".c-reading-time__time");
  expect(time.text()).toBeDefined();
});
