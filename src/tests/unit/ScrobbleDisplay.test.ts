import { mount } from "@vue/test-utils";
import { it, expect, describe, vi, beforeAll, afterAll, afterEach } from "vitest";
// @ts-ignore: Unresolved import
import ScrobbleDisplay from "@components/ScrobbleDisplay.vue";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

server.use(
  http.get("https://last-fm.kasimir.dev", () => {
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
  }),
);

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
});
