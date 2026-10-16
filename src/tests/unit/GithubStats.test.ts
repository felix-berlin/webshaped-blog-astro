import GithubStats from "@components/GithubStats.vue";
import { mount } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { it, expect, describe, beforeEach, vi } from "vitest";
import { nextTick } from "vue";

import { server } from "@/tests/mocks/node";

const mockStats = {
  languagePercentages: [
    { language: "TypeScript", percentage: 60.5 },
    { language: "Vue", percentage: 30.2 },
    { language: "CSS", percentage: 9.3 },
  ],
  mostStarredRepos: [
    {
      name: "awesome-repo",
      url: "https://github.com/user/awesome-repo",
      description: "An awesome repo",
      mostUsedLanguage: "TypeScript",
      stars: 42,
    },
  ],
};

beforeEach(() => {
  server.use(http.get("/api/github/stats", () => HttpResponse.json(mockStats)));
});

describe("GithubStats.vue", () => {
  it("renders without error", () => {
    const wrapper = mount(GithubStats, { props: { lang: "de" } });
    expect(wrapper.exists()).toBe(true);
  });

  it("shows loading skeleton initially", () => {
    const wrapper = mount(GithubStats, { props: { lang: "de" } });
    expect(wrapper.find(".is-skeleton").exists()).toBe(true);
  });

  it("shows the stats card container", () => {
    const wrapper = mount(GithubStats, { props: { lang: "de" } });
    expect(wrapper.find(".c-github-stats-card").exists()).toBe(true);
  });

  it("loads and displays data after fetch", async () => {
    const wrapper = mount(GithubStats, { props: { lang: "de" } });
    expect(wrapper.vm.loading).toBe(true);
    await new Promise((r) => setTimeout(r, 50));
    await nextTick();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.mostStarredRepos).toHaveLength(1);
  });

  it("shows a translated notice when the fetch fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    server.use(
      http.get("/api/github/stats", () =>
        HttpResponse.json({ error: "rate limited" }, { status: 500 }),
      ),
    );
    const wrapper = mount(GithubStats, { props: { lang: "en" } });
    await vi.waitFor(() =>
      expect(wrapper.find(".c-github-stats-card").text()).toBe(
        "The GitHub stats could not be loaded.",
      ),
    );
    expect(console.error).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ message: "HTTP 500: rate limited" }),
    );
  });

  it("shows most starred repos after loading", async () => {
    const wrapper = mount(GithubStats, { props: { lang: "de" } });
    await new Promise((r) => setTimeout(r, 50));
    await nextTick();
    expect(wrapper.vm.mostStarredRepos[0].name).toBe("awesome-repo");
  });

  it("filteredLanguagePercentages excludes languages with 0.00 percentage", async () => {
    server.use(
      http.get("/api/github/stats", () => {
        return HttpResponse.json({
          ...mockStats,
          languagePercentages: [
            { language: "TypeScript", percentage: 0.001 },
            { language: "Vue", percentage: 50 },
          ],
        });
      }),
    );
    const wrapper = mount(GithubStats, { props: { lang: "de" } });
    await new Promise((r) => setTimeout(r, 50));
    await nextTick();
    const filtered = wrapper.vm.filteredLanguagePercentages;
    expect(Object.keys(filtered)).not.toContain("TypeScript");
    expect(Object.keys(filtered)).toContain("Vue");
  });
});
