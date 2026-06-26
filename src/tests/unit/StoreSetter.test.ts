// @ts-ignore: Unresolved import
import StoreSetter from "@components/StoreSetter.vue";
import { currentLanguage, translationRoutes } from "@stores/store";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("StoreSetter.vue", () => {
  it("sets currentLanguage store when lang prop is provided", () => {
    mount(StoreSetter, {
      props: { lang: "en", localeRoutes: {} },
    });
    expect(currentLanguage.get()).toBe("en");
  });

  it("sets currentLanguage to German", () => {
    mount(StoreSetter, {
      props: { lang: "de", localeRoutes: {} },
    });
    expect(currentLanguage.get()).toBe("de");
  });

  it("sets translationRoutes store when localeRoutes prop is provided", () => {
    const routes = { de: "/de/about", en: "/en/about" };
    mount(StoreSetter, {
      props: { lang: "de", localeRoutes: routes },
    });
    expect(translationRoutes.get()).toEqual(routes);
  });

  it("renders slot content", () => {
    const wrapper = mount(StoreSetter, {
      props: { lang: "en", localeRoutes: {} },
      slots: {
        default: "<div class='slot-content'>Content</div>",
      },
    });
    expect(wrapper.find(".slot-content").exists()).toBe(true);
  });

  it("sets empty localeRoutes when not provided", () => {
    mount(StoreSetter, {
      props: { lang: "en" },
    });
    expect(translationRoutes.get()).toEqual({});
  });
});
