import { mount, shallowMount } from "@vue/test-utils";
import { test, expect } from "vitest";

// @ts-ignore: Unresolved import
import SocialList from "@components/SocialList.vue";
import {
  Github,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-vue-next";

describe("SocialList.vue", () => {
  const wrapper = mount(SocialList, {
    props: {
      socialItems: {
        twitter: {
          url: "https://twitter.com",
          label: "Twitter",
          class: "twitter-link",
        },
        github: {
          url: "https://github.com",
          label: "GitHub",
          class: "github-link",
        },
      },
      lang: {
        locale: "en_US",
        id: "en",
      },
    },
  });

  test("Test if all list elements are there", () => {
    const list = wrapper.findAll(".c-social-list__link");
    expect(list).toHaveLength(2);
  });

  test("Test if all components are mounted", () => {
    expect(wrapper.findComponent(Twitter).exists()).toBe(true);
    expect(wrapper.findComponent(Github).exists()).toBe(true);
  });

  test("Test for invisible components", () => {
    expect(wrapper.findComponent(Linkedin).exists()).toBe(false);
    expect(wrapper.findComponent(Youtube).exists()).toBe(false);
    expect(wrapper.findComponent(Instagram).exists()).toBe(false);
    expect(wrapper.findComponent(Facebook).exists()).toBe(false);
  });
});
