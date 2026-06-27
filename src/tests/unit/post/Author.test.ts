// @ts-ignore: Unresolved import
import Author from "@components/post/Author.vue";
import { mount } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { it, expect, describe, beforeAll, afterAll, afterEach } from "vitest";

const server = setupServer(
  http.get("https://last-fm.test", () => {
    return HttpResponse.json({
      recenttracks: {
        track: [],
        "@attr": { total: 0 },
      },
    });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const authorWithAvatar = {
  node: {
    firstName: "John",
    lastName: "Doe",
    description: "A developer",
    avatar: {
      url: "https://example.com/avatar.jpg",
      width: 96,
      height: 96,
    },
  },
};

const authorWithoutAvatar = {
  node: {
    firstName: "Jane",
    lastName: "Smith",
    description: "Another developer",
    avatar: null,
  },
};

describe("Author.vue", () => {
  it("renders the author container", () => {
    const wrapper = mount(Author, {
      props: { author: authorWithAvatar as any, lang: "en" as any },
    });
    expect(wrapper.find(".c-author").exists()).toBe(true);
  });

  it("renders author name", () => {
    const wrapper = mount(Author, {
      props: { author: authorWithAvatar as any, lang: "en" as any },
    });
    expect(wrapper.find(".c-author__name").text()).toBe("John Doe");
  });

  it("renders author description", () => {
    const wrapper = mount(Author, {
      props: { author: authorWithAvatar as any, lang: "en" as any },
    });
    expect(wrapper.find(".c-author__description").text()).toBe("A developer");
  });

  it("renders avatar image when avatar is available", () => {
    const wrapper = mount(Author, {
      props: { author: authorWithAvatar as any, lang: "en" as any },
    });
    const img = wrapper.find(".c-author__image");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("https://example.com/avatar.jpg");
  });

  it("does not render avatar image when avatar is null", () => {
    const wrapper = mount(Author, {
      props: { author: authorWithoutAvatar as any, lang: "en" as any },
    });
    expect(wrapper.find(".c-author__image").exists()).toBe(false);
  });

  it("renders ScrobbleDisplay component", () => {
    const wrapper = mount(Author, {
      props: { author: authorWithAvatar as any, lang: "en" as any },
    });
    expect(wrapper.findComponent({ name: "ScrobbleDisplay" }).exists()).toBe(true);
  });

  it("renders null author gracefully", () => {
    const wrapper = mount(Author, {
      props: { author: null as any, lang: "en" as any },
    });
    expect(wrapper.find(".c-author").exists()).toBe(true);
  });

  it("renders avatar without width/height when values are 0", () => {
    const authorZeroDimensions = {
      node: {
        firstName: "Zero",
        lastName: "Dim",
        description: "No dimensions",
        avatar: {
          url: "https://example.com/avatar.jpg",
          width: 0,
          height: 0,
        },
      },
    };
    const wrapper = mount(Author, {
      props: { author: authorZeroDimensions as any, lang: "en" as any },
    });
    const img = wrapper.find(".c-author__image");
    expect(img.exists()).toBe(true);
    expect(img.attributes("width")).toBeUndefined();
    expect(img.attributes("height")).toBeUndefined();
  });
});
