import { mount } from "@vue/test-utils";
import { test, expect, vi } from "vitest";
import ReadingTime from "@components/post/ReadingTime.vue";

test("Viewing the reading time text", () => {
  const wrapper = mount(ReadingTime, {
    props: {
      time: 12,
      lang: {
        locale: "en_US",
        id: "en",
      }
    },
  });

  const time = wrapper.find(".c-reading-time__time");
  expect(time.text()).toBeDefined();
});
