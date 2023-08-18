import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import SocialList from "@components/SocialList.vue";

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

  it("renders all social links", () => {
    const socialItems = {
      facebook: { url: "https://facebook.com" },
      twitter: { url: "https://twitter.com" },
      instagram: { url: "https://instagram.com" },
      linkedIn: { url: "https://linkedin.com" },
      youTube: { url: "https://youtube.com" },
      github: { url: "https://github.com" },
    };
    const wrapper = mount(SocialList, {
      props: {
        socialItems,
        lang: {
          locale: "en_US",
          id: "en",
        },
      },
    });
    expect(wrapper.findAll(".c-social-list__link")).toHaveLength(6);
  });

  it("renders only social links with URLs", () => {
    const socialItems = {
      facebook: { url: "https://facebook.com" },
      twitter: { url: "https://twitter.com" },
      instagram: { url: null },
      linkedIn: { url: "https://linkedin.com" },
      youTube: { url: null },
      github: { url: "https://github.com" },
    };
    const wrapper = mount(SocialList, {
      props: {
        socialItems,
        lang: {
          locale: "en_US",
          id: "en",
        },
      },
    });
    // console.log(wrapper.html());

    expect(wrapper.findAll(".c-social-list__link")).toHaveLength(4);
  });

  it("renders social links with correct href and target attributes", () => {
    const socialItems = {
      facebook: { url: "https://facebook.com", target: "_self" },
      twitter: { url: "https://twitter.com", target: "_blank" },
      instagram: { url: "https://instagram.com" },
      linkedIn: { url: "https://linkedin.com" },
      youTube: { url: "https://youtube.com" },
      github: { url: "https://github.com" },
    };
    const wrapper = mount(SocialList, {
      props: {
        socialItems,
        lang: {
          locale: "en_US",
          id: "en",
        },
      },
    });
    const links = wrapper.findAll(".c-social-list__link");
    expect(links[0].attributes("href")).toBe("https://facebook.com");
    expect(links[0].attributes("target")).toBe("_self");
    expect(links[1].attributes("href")).toBe("https://twitter.com");
    expect(links[1].attributes("target")).toBe("_blank");
  });

  it("renders social links with correct labels", () => {
    const socialItems = {
      facebook: { url: "https://facebook.com", label: "Facebook" },
      twitter: { url: "https://twitter.com" },
    };

    const wrapper = mount(SocialList, {
      props: {
        socialItems,
        lang: {
          locale: "en_US",
          id: "en",
        },
      },
    });
    const links = wrapper.findAll(".c-social-list__link");
    expect(links[0].attributes("aria-label")).toBe("Facebook");
    expect(links[1].attributes("aria-label")).toBe("Visit me on twitter");
  });
});
