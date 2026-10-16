import ScrobbleDisplay from "@components/ScrobbleDisplay.vue";
import { mount, flushPromises } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { it, expect, describe, vi, beforeEach, afterEach } from "vitest";

import { server } from "@/tests/mocks/node";

const API = "https://last-fm.test";
const requests = vi.fn();

const lastFmResponse = (nowPlaying: boolean) => ({
  recenttracks: {
    track: [
      {
        name: "Song 1",
        artist: { "#text": "Artist 1" },
        album: { "#text": "Album 1" },
        image: [{ "#text": "image1.png" }, { "#text": "image2.png" }],
        url: "https://www.last.fm/music/Artist+1/_/Song+1",
        ...(nowPlaying ? { "@attr": { nowplaying: "true" } } : {}),
      },
    ],
    "@attr": { total: "1", user: "felix" },
  },
});

const mountDisplay = (props: Record<string, unknown> = {}) =>
  mount(ScrobbleDisplay, {
    props: { numberOfDisplayedTracks: 1, scrobbleApi: API, lang: "de", updateRate: 1000, ...props },
  });

beforeEach(() => {
  requests.mockClear();
  server.use(
    http.get(API, ({ request }) => {
      requests(new URL(request.url).searchParams.get("limit"));
      return HttpResponse.json(lastFmResponse(true));
    }),
  );
});

// Settle the pending fetch while this file's environment is still alive.
afterEach(async () => {
  await flushPromises();
  vi.useRealTimers();
});

describe("ScrobbleDisplay", () => {
  it("fetches the configured number of tracks on mount", async () => {
    const wrapper = mountDisplay();
    await vi.waitFor(() => expect(requests).toHaveBeenCalledWith("1"));
    wrapper.unmount();
  });

  it("animates the music bars while a track is playing", async () => {
    const wrapper = mountDisplay();
    await vi.waitFor(() =>
      expect(wrapper.findComponent({ name: "MusicBars" }).props("animate")).toBe(true),
    );
    wrapper.unmount();
  });

  it("renders the dropdown", () => {
    const wrapper = mountDisplay();
    wrapper.find(".c-scrobble-display__music-bar").trigger("click");
    expect(wrapper.findComponent({ name: "VPopperContent" }).exists()).toBe(true);
    wrapper.unmount();
  });

  it("stops polling after idleAfterCount background updates", async () => {
    vi.useFakeTimers();
    const wrapper = mountDisplay({ idleAfterCount: 1 });
    await vi.waitFor(() => expect(requests).toHaveBeenCalledTimes(1));

    await vi.advanceTimersByTimeAsync(1000);
    await vi.waitFor(() => expect(requests).toHaveBeenCalledTimes(2));

    await vi.advanceTimersByTimeAsync(5000);
    expect(requests).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it("stops polling on unmount", async () => {
    vi.useFakeTimers();
    const wrapper = mountDisplay();
    await vi.waitFor(() => expect(requests).toHaveBeenCalledTimes(1));
    wrapper.unmount();

    await vi.advanceTimersByTimeAsync(5000);
    expect(requests).toHaveBeenCalledTimes(1);
  });
});
