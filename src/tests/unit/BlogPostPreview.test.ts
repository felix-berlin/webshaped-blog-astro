// @ts-ignore: Unresolved import
import BlogPostPreview from "@components/BlogPostPreview.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

const mockPosts = [
  {
    title: "JavaScript Tutorial",
    slug: "javascript-tutorial",
    excerpt: "<p>Learn JavaScript basics.</p>",
    language: { locale: "en_US", slug: "en", code: "EN", id: "en" },
  },
  {
    title: "Vue 3 Guide",
    slug: "vue-3-guide",
    excerpt: "<p>Master Vue 3.</p>",
    language: { locale: "en_US", slug: "en", code: "EN", id: "en" },
  },
];

describe("BlogPostPreview.vue", () => {
  it("renders an article for each post", () => {
    const wrapper = mount(BlogPostPreview, {
      props: { posts: mockPosts as any },
    });

    const articles = wrapper.findAll(".c-post-card");
    expect(articles).toHaveLength(2);
  });

  it("renders post titles", () => {
    const wrapper = mount(BlogPostPreview, {
      props: { posts: mockPosts as any },
    });

    const titles = wrapper.findAll(".c-post-card__title");
    expect(titles[0].text()).toBe("JavaScript Tutorial");
    expect(titles[1].text()).toBe("Vue 3 Guide");
  });

  it("renders post excerpts", () => {
    const wrapper = mount(BlogPostPreview, {
      props: { posts: mockPosts as any },
    });

    const excerpts = wrapper.findAll(".c-post-card__excerpt");
    expect(excerpts[0].html()).toContain("Learn JavaScript basics.");
  });

  it("links to the correct post URL", () => {
    const wrapper = mount(BlogPostPreview, {
      props: { posts: mockPosts as any },
    });

    const links = wrapper.findAll(".c-post-card__link");
    expect(links[0].attributes("href")).toBe("/en/posts/javascript-tutorial");
  });

  it("renders read-more section", () => {
    const wrapper = mount(BlogPostPreview, {
      props: { posts: mockPosts as any },
    });

    expect(wrapper.find(".c-post-card__read-more").exists()).toBe(true);
  });

  it("renders with German locale posts", () => {
    const dePosts = [
      {
        title: "JavaScript Anleitung",
        slug: "javascript-anleitung",
        excerpt: "<p>Lerne JavaScript.</p>",
        language: { locale: "de_DE", slug: "de", code: "DE", id: "de" },
      },
    ];

    const wrapper = mount(BlogPostPreview, {
      props: { posts: dePosts as any },
    });

    const link = wrapper.find(".c-post-card__link");
    expect(link.attributes("href")).toBe("/de/posts/javascript-anleitung");
  });
});
