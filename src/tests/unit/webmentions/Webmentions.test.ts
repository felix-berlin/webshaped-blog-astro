import Webmentions from "@components/webmentions/Webmentions.vue";
import { flushPromises, mount } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { it, expect, describe, vi } from "vitest";
import { defineComponent, h, Suspense } from "vue";

import { server } from "@/tests/mocks/node";

vi.mock("@components/webmentions/WebmentionsItem.vue", async () => {
  const { defineComponent, h } = await vi.importActual<typeof import("vue")>("vue");
  return {
    __esModule: true,
    default: defineComponent({
      name: "WebmentionsItem",
      render: () => h("div", { class: "webmentions-item-stub" }),
    }),
  };
});

const MENTIONS_API = "https://webmention.io/api/mentions.jf2";

const mockMentions = (children: unknown[], onRequest?: (url: URL) => void) =>
  server.use(
    http.get(MENTIONS_API, ({ request }) => {
      onRequest?.(new URL(request.url));
      return HttpResponse.json({ children });
    }),
  );

// Webmentions has an async setup, so it only renders inside <Suspense>;
// assertions wait for the fetch and the async child components to resolve.
const mountWebmentions = async (props: Record<string, unknown>) => {
  const wrapper = mount(
    defineComponent({ render: () => h(Suspense, null, { default: () => h(Webmentions, props) }) }),
  );
  await flushPromises();
  return wrapper;
};

describe("Webmentions.vue", () => {
  it("shows NoMentions and no list when there are no mentions", async () => {
    mockMentions([]);
    const wrapper = await mountWebmentions({ target: "https://example.com/post", lang: "de" });
    await vi.waitFor(() =>
      expect(wrapper.findComponent({ name: "NoMentions" }).exists()).toBe(true),
    );
    expect(wrapper.find(".c-webmentions").exists()).toBe(false);
  });

  it("renders one item per mention", async () => {
    mockMentions([{ "wm-id": 1 }, { "wm-id": 2 }]);
    const wrapper = await mountWebmentions({ target: "https://example.com/post", lang: "de" });
    await vi.waitFor(() => expect(wrapper.findAll(".webmentions-item-stub")).toHaveLength(2));
  });

  it("requests mentions for the given target", async () => {
    let target: null | string = null;
    mockMentions([], (url) => (target = url.searchParams.get("target")));
    await mountWebmentions({ target: "https://example.com/post", lang: "de" });
    await vi.waitFor(() => expect(target).toBe("https://example.com/post"));
  });

  it("falls back to window.location.href as target", async () => {
    let target: null | string = null;
    mockMentions([], (url) => (target = url.searchParams.get("target")));
    await mountWebmentions({ lang: "de" });
    await vi.waitFor(() => expect(target).toBe(window.location.href));
  });
});
