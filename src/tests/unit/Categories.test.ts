// @ts-ignore: Unresolved import
import Categories from "@components/Categories.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("Categories.vue", () => {
  const wrapper = mount(Categories, {
    props: {
      lang: "en",
      categories: {
        edges: [
          {
            node: {
              name: "Coool Tech",
              parent: null,
              children: {
                edges: [],
              },
            },
          },
        ],
      },
    },
  });

  const emptyWrapper = mount(Categories, {
    props: {
      lang: "en",
      categories: {
        edges: [
          {
            node: {
              name: "Uncategorized",
              parent: null,
              children: {
                edges: [],
              },
            },
          },
        ],
      },
    },
  });

  it("Viewing the reading time text", () => {
    const categoryList = wrapper.find(".c-categories");
    expect(categoryList.text()).toBeDefined();
  });

  it("Is component hidden?", () => {
    const categoryList = emptyWrapper.find(".c-categories");
    expect(categoryList.exists()).toBe(false);
  });

  it("renders comma separator between multiple categories", () => {
    const multiWrapper = mount(Categories, {
      props: {
        lang: "en",
        categories: {
          edges: [
            { node: { name: "JavaScript", id: "1", slug: "javascript" } },
            { node: { name: "PHP", id: "2", slug: "php" } },
            { node: { name: "CSS", id: "3", slug: "css" } },
          ],
        } as any,
      },
    });
    expect(multiWrapper.find(".c-categories__item-wrap").text()).toContain(",");
  });
});
