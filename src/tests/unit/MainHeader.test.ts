import { shallowMount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import MainHeader from "@components/hero/MainHeader.vue";

describe("MainHeader", () => {
  it("renders the MainNav component", () => {
    const menuItems = {
      nodes: [
        {
          label: "Beiträge",
          order: 1,
          path: "/",
          childItems: {
            nodes: [
              { label: "JavaScript", order: 2, path: "/category/javascript/" },
              { label: "PHP", order: 3, path: "/category/php/" },
              { label: "WordPress", order: 4, path: "/category/wordpress/" },
              { label: "Matomo", order: 5, path: "/category/matomo/" },
              { label: "VS Code", order: 6, path: "/category/vs-code/" },
            ],
          },
        },
      ],
    };
    const wrapper = shallowMount(MainHeader, {
      props: {
        menuItems,
        lang: {
          locale: "de_DE",
          id: "de",
        },
      },
    });

    expect(wrapper.findComponent({ name: "MainNav" }).exists()).toBe(true);
  });
});
