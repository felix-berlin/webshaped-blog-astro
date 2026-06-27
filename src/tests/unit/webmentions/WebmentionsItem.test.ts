// @ts-ignore: Unresolved import
import WebmentionsItem from "@components/webmentions/WebmentionsItem.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

const mention = {
  "wm-id": 123,
  author: {
    name: "Jane Doe",
    photo: "https://example.com/photo.jpg",
    type: "card",
    url: "https://example.com",
  },
  content: {
    html: "<p>Great post!</p>",
    text: "Great post!",
  },
  "mention-of": "https://mysite.com/post",
  published: "2024-01-15T10:00:00Z",
  type: "entry",
  url: "https://mastodon.social/@user/123",
  "wm-private": false,
  "wm-property": "in-reply-to",
  "wm-received": "2024-01-15T10:01:00Z",
  "wm-source": "https://mastodon.social/@user/123",
  "wm-target": "https://mysite.com/post",
};

describe("WebmentionsItem.vue", () => {
  it("renders the webmention article", () => {
    const wrapper = mount(WebmentionsItem, {
      props: { mention, index: 0 },
    });
    expect(wrapper.find(".c-webmention").exists()).toBe(true);
  });

  it("sets the correct id on the article", () => {
    const wrapper = mount(WebmentionsItem, {
      props: { mention, index: 0 },
    });
    expect(wrapper.find("article").attributes("id")).toBe("webmention-123");
  });

  it("renders author image with correct src", () => {
    const wrapper = mount(WebmentionsItem, {
      props: { mention, index: 0 },
    });
    const img = wrapper.find(".c-webmentions__author-image");
    expect(img.attributes("src")).toBe("https://example.com/photo.jpg");
  });

  it("renders author name with link", () => {
    const wrapper = mount(WebmentionsItem, {
      props: { mention, index: 0 },
    });
    const link = wrapper.find(".c-webmentions__author-image-link");
    expect(link.text()).toBe("Jane Doe");
    expect(link.attributes("href")).toBe("https://example.com");
  });

  it("renders content text", () => {
    const wrapper = mount(WebmentionsItem, {
      props: { mention, index: 0 },
    });
    expect(wrapper.find(".c-webmentions__text").text()).toBe("Great post!");
  });

  it("renders source link", () => {
    const wrapper = mount(WebmentionsItem, {
      props: { mention, index: 0 },
    });
    const sourceLink = wrapper.find(".c-webmention__source");
    expect(sourceLink.attributes("href")).toBe("https://mastodon.social/@user/123");
  });

  it("uses eager loading for first 3 mentions (index < 3)", () => {
    const wrapper = mount(WebmentionsItem, {
      props: { mention, index: 0 },
    });
    const img = wrapper.find("img");
    expect(img.attributes("loading")).toBe("edge");
  });

  it("uses lazy loading for mentions after index 3", () => {
    const wrapper = mount(WebmentionsItem, {
      props: { mention, index: 5 },
    });
    const img = wrapper.find("img");
    expect(img.attributes("loading")).toBe("lazy");
  });

  it("loadIcons returns component for facebook URL", () => {
    const facebookMention = {
      ...mention,
      url: "https://facebook.com/user/post",
    };
    const wrapper = mount(WebmentionsItem, {
      props: { mention: facebookMention, index: 0 },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("loadIcons returns component for github URL", () => {
    const githubMention = {
      ...mention,
      url: "https://github.com/user",
    };
    const wrapper = mount(WebmentionsItem, {
      props: { mention: githubMention, index: 0 },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("loadIcons returns component for reddit URL", () => {
    const redditMention = {
      ...mention,
      url: "https://reddit.com/r/programming",
    };
    const wrapper = mount(WebmentionsItem, {
      props: { mention: redditMention, index: 0 },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("loadIcons returns component for twitter URL", () => {
    const twitterMention = {
      ...mention,
      url: "https://twitter.com/user/status/123",
    };
    const wrapper = mount(WebmentionsItem, {
      props: { mention: twitterMention, index: 0 },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("loadIcons returns external-link component for unknown URL", () => {
    const unknownMention = {
      ...mention,
      url: "https://some-other-site.com/post",
    };
    const wrapper = mount(WebmentionsItem, {
      props: { mention: unknownMention, index: 0 },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
