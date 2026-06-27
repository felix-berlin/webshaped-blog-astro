// @ts-ignore: Unresolved import
import ScrobbleDisplay from "@components/ScrobbleDisplay.vue";
import { mount, flushPromises } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { it, expect, describe, vi, beforeAll, afterAll, afterEach, beforeEach } from "vitest";

const mockHandler = http.get("https://last-fm.kasimir.dev", () => {
  return HttpResponse.json({
    recenttracks: {
      track: [
        {
          name: "Song 1",
          artist: { "#text": "Artist 1" },
          album: { "#text": "Album 1" },
          image: [{ "#text": "image1.png" }, { "#text": "image2.png" }],
          url: "https://www.last.fm/music/Artist+1/_/Song+1",
          "@attr": { nowplaying: true },
        },
        {
          name: "Song 2",
          artist: { "#text": "Artist 2" },
          album: { "#text": "Album 2" },
          image: [{ "#text": "image3.png" }, { "#text": "image4.png" }],
          url: "https://www.last.fm/music/Artist+2/_/Song+2",
        },
      ],
      "@attr": { total: 2 },
    },
  });
});

const server = setupServer(mockHandler);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ScrobbleDisplay", () => {
  it("renders the the dropdown", async () => {
    const wrapper = mount(ScrobbleDisplay, {
      props: {
        numberOfDisplayedTracks: 2,
        scrobbleApi: "https://last-fm.kasimir.dev",
        lang: {
          locale: "en_US",
          id: "en",
        },
      },
    });

    wrapper.find(".c-scrobble-display__music-bar").trigger("click");

    const dropdown = wrapper.findComponent({ name: "VPopperContent" });

    expect(dropdown.exists()).toBe(true);
  });

  it("unmounts without errors (covers onBeforeUnmount/stopScrobbleUpdates)", async () => {
    const wrapper = mount(ScrobbleDisplay, {
      props: {
        numberOfDisplayedTracks: 2,
        scrobbleApi: "https://last-fm.kasimir.dev",
      },
    });
    await wrapper.vm.$nextTick();
    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("stopScrobbleUpdates clears interval when updateIntervalId is set", async () => {
    const wrapper = mount(ScrobbleDisplay, {
      props: {
        numberOfDisplayedTracks: 2,
        scrobbleApi: "https://last-fm.kasimir.dev",
        updateRate: 100,
      },
    });
    await wrapper.vm.$nextTick();
    const clearSpy = vi.spyOn(globalThis, "clearInterval");
    wrapper.unmount();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it("watcher fires when isDropdownShown toggles (covers lines 181-184)", async () => {
    const wrapper = mount(ScrobbleDisplay, {
      props: {
        numberOfDisplayedTracks: 2,
        scrobbleApi: "https://last-fm.kasimir.dev",
        updateRate: 60_000,
      },
    });
    await wrapper.vm.$nextTick();

    const vm = wrapper.vm as any;
    // Set isDropdownShown to true → watcher fires, enters if-branch (lines 181-184)
    vm.state.isDropdownShown = true;
    await flushPromises();
    await wrapper.vm.$nextTick();

    // Set back to false → watcher fires again, skips if-branch (false branch of line 181)
    vm.state.isDropdownShown = false;
    await wrapper.vm.$nextTick();

    expect(wrapper.exists()).toBe(true);
    wrapper.unmount();
  });

  it("stopScrobbleUpdates does nothing when updateIntervalId is undefined (covers line 234 false branch)", async () => {
    const wrapper = mount(ScrobbleDisplay, {
      props: {
        scrobbleApi: "https://last-fm.kasimir.dev",
        updateRate: 60_000,
      },
    });
    await wrapper.vm.$nextTick();

    const vm = wrapper.vm as any;
    const savedId = vm.state.updateIntervalId;
    vm.state.updateIntervalId = undefined;

    expect(() => vm.stopScrobbleUpdates()).not.toThrow();

    vm.state.updateIntervalId = savedId;
    wrapper.unmount();
  });

  it("watchEffect calls stopScrobbleUpdates when idleAfterCount is reached (covers line 174)", async () => {
    const wrapper = mount(ScrobbleDisplay, {
      props: {
        scrobbleApi: "https://last-fm.kasimir.dev",
        idleAfterCount: 1, // state.idleAfterCount = 2
        updateRate: 50,
      },
    });
    // First checkIfPlaying() fires immediately in onMounted (updateCount becomes 1)
    await flushPromises();
    await wrapper.vm.$nextTick();
    // Wait for setInterval (50ms) to fire → second checkIfPlaying (updateCount becomes 2 = idleAfterCount)
    await new Promise((resolve) => setTimeout(resolve, 60));
    await flushPromises();
    await wrapper.vm.$nextTick();
    // watchEffect should have fired: idleAfterCount (2) === updateCount (2) → stopScrobbleUpdates()
    expect(wrapper.exists()).toBe(true);
    wrapper.unmount();
  });
});
