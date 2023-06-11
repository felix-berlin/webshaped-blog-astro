import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import MusicBars from "@components/MusicBars.vue";

describe("MusicBars.vue", () => {
  const wrapper = mount(MusicBars);

  test("Is component visible?", () => {
    const categoryList = wrapper.find(".o-music-bars");
    expect(categoryList.exists()).toBe(true);
  });
});
