import Pagination from "@components/Pagination.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("Pagination", () => {
  it("renders the correct number of pages", () => {
    const wrapper = mount(Pagination, {
      props: {
        page: {
          lastPage: 5,
          currentPage: 1,
          url: {
            prev: null,
            next: "/page/2",
          },
          start: 1,
        },
        slug: "javascript",
        lang: "en",
      },
    });

    const pages = wrapper.findAll(".c-pagination__item");
    expect(pages).toHaveLength(9); // 5 pages + first, last, next and previous page links
  });

  it("disables the previous button on the first page", () => {
    const wrapper = mount(Pagination, {
      props: {
        page: {
          lastPage: 5,
          currentPage: 1,
          url: {
            prev: null,
            next: "/page/2",
          },
          start: 1,
        },
        slug: "javascript",
        lang: "en",
      },
    });

    const prevButton = wrapper.find(".c-pagination__item.is-disabled .c-pagination__link");
    expect(prevButton.exists()).toBe(true);
  });

  it("disables the next button on the last page", () => {
    const wrapper = mount(Pagination, {
      props: {
        page: {
          lastPage: 5,
          currentPage: 5,
          url: {
            prev: "/page/4",
            next: null,
          },
          start: 41,
        },
        slug: "javascript",
        lang: "en",
      },
    });

    const nextButton = wrapper.find(".c-pagination__item.is-disabled .c-pagination__link");
    expect(nextButton.exists()).toBe(true);
  });

  it("renders the correct page links", () => {
    const wrapper = mount(Pagination, {
      props: {
        page: {
          lastPage: 5,
          currentPage: 3,
          url: {
            prev: "/page/2",
            next: "/page/4",
          },
          start: 21,
        },
        slug: "javascript",
        lang: "en",
      },
    });

    const pages = wrapper.findAll(".c-pagination__item .c-pagination__link");

    expect(pages).toHaveLength(9);
    expect(pages[2].text()).toBe("1");
    expect(pages[3].text()).toBe("2");
    expect(pages[4].text()).toBe("3");
    expect(pages[5].text()).toBe("4");
    expect(pages[6].text()).toBe("5");
  });

  it("links the first/last buttons and page numbers to the category archive pages", () => {
    const wrapper = mount(Pagination, {
      props: {
        page: { lastPage: 3, currentPage: 2, url: { prev: "/x/1", next: "/x/3" }, start: 6 },
        slug: "javascript",
        lang: "en",
      },
    });

    const hrefs = wrapper.findAll("a.c-pagination__link").map((link) => link.attributes("href"));
    expect(hrefs).toEqual([
      "/en/category/javascript/1",
      "/x/1",
      "/en/category/javascript/1",
      "/en/category/javascript/2",
      "/en/category/javascript/3",
      "/x/3",
      "/en/category/javascript/3",
    ]);
  });
});
