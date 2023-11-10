import { mount } from "@vue/test-utils";
import { describe, beforeEach, expect, it } from "vitest";
import HasTranslations from "@components/HasTranslations.vue";

describe("HasTranslations.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(HasTranslations, {
      propsData: {
        translations: [{ slug: "test-helpful-en", language: { slug: "en", name: "English" } }],
        lang: {
          code: "DE",
          locale: "de_DE",
        },
      },
    });
  });

  it("renders translations when present", () => {
    const translations = wrapper.findAll(".c-has-translation__translations");
    expect(translations.length).toBeGreaterThan(0);
  });

  it("renders correct href for each translation", () => {
    const links = wrapper.findAll(".c-has-translation__link");

    links.forEach((link, i) => {
      expect(link.attributes("href")).toBe(
        `/${wrapper.props().translations[i].language.slug}/${wrapper.props().translations[i].slug}`,
      );
    });
  });

  it("does not render .c-has-translation when translations is empty", () => {
    wrapper = mount(HasTranslations, {
      propsData: {
        translations: [],
        lang: {
          code: "DE",
          locale: "de_DE",
        },
      },
    });
    expect(wrapper.find(".c-has-translation").exists()).toBe(false);
  });

  it("renders .c-has-translation when translations is not empty", () => {
    expect(wrapper.find(".c-has-translation").exists()).toBe(true);
  });
});
