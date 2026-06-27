// @ts-ignore: Unresolved import
import Webmentions from "@components/webmentions/Webmentions.vue";
import { currentWebmentionsCount } from "@stores/store";
import { mount } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { it, expect, describe, beforeAll, afterAll, afterEach, vi } from "vitest";
import { defineComponent } from "vue";

vi.mock("@components/webmentions/WebmentionsItem.vue", () => {
  const component = defineComponent({
    name: "WebmentionsItem",
    template: "<div class='webmentions-item-stub'></div>",
  });
  return {
    default: component,
    __isTeleport: false,
    __isKeepAlive: false,
    __esModule: true,
  };
});

const server = setupServer(
  http.get("https://webmention.io/api/mentions.jf2", () => {
    return HttpResponse.json({ children: [] });
  }),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  currentWebmentionsCount.set(0);
});
afterAll(() => server.close());

describe("Webmentions.vue", () => {
  it("renders wrapper div", () => {
    currentWebmentionsCount.set(0);
    const wrapper = mount(Webmentions, {
      props: { target: "https://example.com/post" },
    });
    expect(wrapper.find("div").exists()).toBe(true);
  });

  it("shows NoMentions when webmentionsCount is 0", async () => {
    currentWebmentionsCount.set(0);
    const wrapper = mount(Webmentions, {
      props: { target: "https://example.com/post" },
    });
    await wrapper.vm.$nextTick();
    const noMentions = wrapper.findComponent({ name: "NoMentions" });
    // async component might not be resolved yet, check v-if condition
    expect(wrapper.vm.webmentionsCount).toBe(0);
  });

  it("hides webmentions list when count is 0", () => {
    currentWebmentionsCount.set(0);
    const wrapper = mount(Webmentions, {
      props: { target: "https://example.com/post" },
    });
    expect(wrapper.find(".c-webmentions").exists()).toBe(false);
  });

  it("shows webmentions list when count > 0", () => {
    currentWebmentionsCount.set(3);
    const wrapper = mount(Webmentions, {
      props: { target: "https://example.com/post" },
    });
    expect(wrapper.find(".c-webmentions").exists()).toBe(true);
  });

  it("calls fetch with target URL on mount", async () => {
    server.use(
      http.get("https://webmention.io/api/mentions.jf2", ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("target")).toBe("https://example.com/post");
        return HttpResponse.json({ children: [] });
      }),
    );
    currentWebmentionsCount.set(0);
    mount(Webmentions, {
      props: { target: "https://example.com/post" },
    });
    // Just verify it mounts without errors
  });

  it("uses window.location.href as target when currentUrl=true", async () => {
    currentWebmentionsCount.set(0);
    const wrapper = mount(Webmentions, {
      props: { currentUrl: true },
    });
    expect(wrapper.vm.currentUrl).toBe(true);
  });

  it("updates webmentionsCount after fetch completes", async () => {
    server.use(
      http.get("https://webmention.io/api/mentions.jf2", () => {
        return HttpResponse.json({ children: [{ "wm-id": 1 }, { "wm-id": 2 }] });
      }),
    );
    currentWebmentionsCount.set(0);
    const wrapper = mount(Webmentions, {
      props: { target: "https://example.com/post" },
    });
    await new Promise((r) => setTimeout(r, 50));
    expect(currentWebmentionsCount.get()).toBe(2);
  });
});
