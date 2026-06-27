// @ts-ignore: Unresolved import
import GithubStats from "@components/GithubStats.vue";
import { mount } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { it, expect, describe, beforeAll, afterAll, afterEach, vi } from "vitest";
import { nextTick } from "vue";

const mockStats = {
  languagePercentages: [
    { language: "TypeScript", percentage: 60.5 },
    { language: "Vue", percentage: 30.2 },
    { language: "CSS", percentage: 9.3 },
  ],
  totalBytes: 100000,
  totalCommits: 500,
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

const server = setupServer(
  http.get("/api/github/stats", () => {
    return HttpResponse.json(mockStats);
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("GithubStats.vue", () => {
  it("renders without error", () => {
    const wrapper = mount(GithubStats);
    expect(wrapper.exists()).toBe(true);
  });

  it("shows loading skeleton initially", () => {
    const wrapper = mount(GithubStats);
    expect(wrapper.find(".is-skeleton").exists()).toBe(true);
  });

  it("shows the stats card container", () => {
    const wrapper = mount(GithubStats);
    expect(wrapper.find(".c-github-stats-card").exists()).toBe(true);
  });

  it("loads and displays data after fetch", async () => {
    const wrapper = mount(GithubStats);
    expect(wrapper.vm.loading).toBe(true);
    await new Promise((r) => setTimeout(r, 50));
    await nextTick();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.mostStarredRepos).toHaveLength(1);
  });

  it("displays error message when fetch fails", async () => {
    server.use(
      http.get("/api/github/stats", () => {
        return new HttpResponse(null, { status: 500, statusText: "Internal Server Error" });
      }),
    );
    const wrapper = mount(GithubStats);
    await new Promise((r) => setTimeout(r, 50));
    await nextTick();
    expect(wrapper.vm.error).toBeTruthy();
    expect(wrapper.find(".c-github-stats-card").exists()).toBe(true);
  });

  it("shows most starred repos after loading", async () => {
    const wrapper = mount(GithubStats);
    await new Promise((r) => setTimeout(r, 50));
    await nextTick();
    expect(wrapper.vm.mostStarredRepos[0].name).toBe("awesome-repo");
  });

  it("formatLargeNumber formats numbers with dot separators", () => {
    const wrapper = mount(GithubStats);
    expect((wrapper.vm as any).formatLargeNumber(1234567)).toBe("1.234.567");
    expect((wrapper.vm as any).formatLargeNumber(1000)).toBe("1.000");
    expect((wrapper.vm as any).formatLargeNumber(999)).toBe("999");
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
    const wrapper = mount(GithubStats);
    await new Promise((r) => setTimeout(r, 50));
    await nextTick();
    const filtered = wrapper.vm.filteredLanguagePercentages;
    expect(Object.keys(filtered)).not.toContain("TypeScript");
    expect(Object.keys(filtered)).toContain("Vue");
  });
});
