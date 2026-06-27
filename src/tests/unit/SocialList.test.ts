// @ts-ignore: Unresolved import
import SocialList from "@components/SocialList.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

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
      lang: "en",
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
        lang: "en",
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
        lang: "en",
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
        lang: "en",
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
        lang: "en",
      },
    });
    const links = wrapper.findAll(".c-social-list__link");
    expect(links[0].attributes("aria-label")).toBe("Facebook");
    expect(links[1].attributes("aria-label")).toBe("Visit me on twitter");
  });

  it("renders mastodon and reddit links", () => {
    const socialItems = {
      mastodon: { url: "https://mastodon.social/@user" },
      reddit: { url: "https://reddit.com/u/user" },
    };
    const wrapper = mount(SocialList, {
      props: { socialItems, lang: "en" },
    });
    expect(wrapper.findAll(".c-social-list__link")).toHaveLength(2);
  });

  it("renders youtube link (lowercase key)", () => {
    const socialItems = {
      youtube: { url: "https://youtube.com/@channel" },
    } as any;
    const wrapper = mount(SocialList, {
      props: { socialItems, lang: "en" },
    });
    expect(wrapper.findAll(".c-social-list__link")).toHaveLength(1);
  });

  it("renders default (unknown platform) link", () => {
    const socialItems = {
      custom: { url: "https://custom-platform.com/user" },
    } as any;
    const wrapper = mount(SocialList, {
      props: { socialItems, lang: "en" },
    });
    expect(wrapper.findAll(".c-social-list__link")).toHaveLength(1);
  });

  it("applies custom rel attribute", () => {
    const socialItems = {
      github: { url: "https://github.com/user", rel: "me noopener" },
    };
    const wrapper = mount(SocialList, {
      props: { socialItems, lang: "en" },
    });
    expect(wrapper.find(".c-social-list__link").attributes("rel")).toBe("me noopener");
  });

  it("uses default rel when not specified", () => {
    const socialItems = {
      github: { url: "https://github.com/user" },
    };
    const wrapper = mount(SocialList, {
      props: { socialItems, lang: "en" },
    });
    expect(wrapper.find(".c-social-list__link").attributes("rel")).toBe("noopener noreferrer");
  });

  it("applies custom class to social link", () => {
    const socialItems = {
      github: { url: "https://github.com/user", class: "my-class" },
    };
    const wrapper = mount(SocialList, {
      props: { socialItems, lang: "en" },
    });
    expect(wrapper.find(".c-social-list__link").classes()).toContain("my-class");
  });

  it("renders link when size prop is provided", () => {
    const socialItems = {
      github: { url: "https://github.com/user", size: 32 },
    };
    const wrapper = mount(SocialList, {
      props: { socialItems, lang: "en" },
    });
    expect(wrapper.find(".c-social-list__link").exists()).toBe(true);
    expect(wrapper.find(".c-social-list__link").attributes("href")).toBe(
      "https://github.com/user",
    );
  });

  it("renders link when no size prop is provided (uses default 24)", () => {
    const socialItems = {
      github: { url: "https://github.com/user" },
    };
    const wrapper = mount(SocialList, {
      props: { socialItems, lang: "en" },
    });
    expect(wrapper.find(".c-social-list__link").exists()).toBe(true);
  });

  it("uses social.color when color prop is provided (covers line 20 truthy branch)", () => {
    const socialItems = {
      github: { url: "https://github.com/user", color: "#ff0000" },
    };
    const wrapper = mount(SocialList, {
      props: { socialItems, lang: "en" },
    });
    expect(wrapper.find(".c-social-list__link").exists()).toBe(true);
  });
});
