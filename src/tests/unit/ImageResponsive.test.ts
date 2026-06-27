// @ts-ignore: Unresolved import
import ImageResponsive from "@components/ImageResponsive.vue";
import { mount } from "@vue/test-utils";
import { it, expect, describe } from "vitest";

describe("ImageResponsive.vue", () => {
  it("renders a picture element when src is provided", () => {
    const wrapper = mount(ImageResponsive, {
      props: { src: "https://example.com/image.jpg" },
    });
    expect(wrapper.find("picture").exists()).toBe(true);
  });

  it("does not render when src is null", () => {
    const wrapper = mount(ImageResponsive, {
      props: { src: null },
    });
    expect(wrapper.find("picture").exists()).toBe(false);
  });

  it("renders img with correct src and alt", () => {
    const wrapper = mount(ImageResponsive, {
      props: { src: "https://example.com/image.jpg", alt: "Test alt" },
    });
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe("https://example.com/image.jpg");
    expect(img.attributes("alt")).toBe("Test alt");
  });

  it("renders img with empty alt when alt is null", () => {
    const wrapper = mount(ImageResponsive, {
      props: { src: "https://example.com/image.jpg", alt: null },
    });
    expect(wrapper.find("img").attributes("alt")).toBe("");
  });

  it("renders img with loading=lazy by default", () => {
    const wrapper = mount(ImageResponsive, {
      props: { src: "https://example.com/image.jpg" },
    });
    expect(wrapper.find("img").attributes("loading")).toBe("lazy");
  });

  it("renders img with loading=eager when aboveTheFold=true", () => {
    const wrapper = mount(ImageResponsive, {
      props: { src: "https://example.com/image.jpg", aboveTheFold: true },
    });
    expect(wrapper.find("img").attributes("loading")).toBe("eager");
    expect(wrapper.find("img").attributes("fetchpriority")).toBe("high");
  });

  it("creates webp srcset from srcSet string", () => {
    const wrapper = mount(ImageResponsive, {
      props: {
        src: "https://example.com/image.jpg",
        srcSet: "https://example.com/image-300.jpg 300w, https://example.com/image-600.jpg 600w",
      },
    });
    const sources = wrapper.findAll("source");
    const webpSource = sources.find((s) => s.attributes("type") === "image/webp");
    expect(webpSource?.attributes("srcset")).toContain(".webp");
  });

  it("creates jpeg srcset from srcSet string", () => {
    const wrapper = mount(ImageResponsive, {
      props: {
        src: "https://example.com/image.jpg",
        srcSet: "https://example.com/image-300.jpg 300w, https://example.com/image-600.jpg 600w",
      },
    });
    const sources = wrapper.findAll("source");
    const jpegSource = sources.find((s) => s.attributes("type") === "image/jpeg");
    expect(jpegSource?.attributes("srcset")).toContain(".jpeg");
  });

  it("returns srcSet unchanged for gif images", () => {
    const originalSrcSet = "https://example.com/image-300.gif 300w";
    const wrapper = mount(ImageResponsive, {
      props: {
        src: "https://example.com/image.gif",
        srcSet: originalSrcSet,
      },
    });
    const sources = wrapper.findAll("source");
    expect(sources[0].attributes("srcset")).toBe(originalSrcSet);
  });

  it("returns srcSet unchanged for svg images", () => {
    const originalSrcSet = "https://example.com/image.svg 300w";
    const wrapper = mount(ImageResponsive, {
      props: {
        src: "https://example.com/image.svg",
        srcSet: originalSrcSet,
      },
    });
    const sources = wrapper.findAll("source");
    expect(sources[0].attributes("srcset")).toBe(originalSrcSet);
  });

  it("renders img with width and height", () => {
    const wrapper = mount(ImageResponsive, {
      props: { src: "https://example.com/image.jpg", width: 800, height: 600 },
    });
    const img = wrapper.find("img");
    expect(img.attributes("width")).toBe("800");
    expect(img.attributes("height")).toBe("600");
  });
});
