<template>
  <div class="c-scrobble-display">
    <VDropdown
      v-model:shown="state.isDropdownShown"
      popper-class="c-scrobble-display__dropdown"
      :placement="dropdownPlacement"
      :distance="10"
    >
      <MusicBars
        :animate="state.scrobbling"
        class="c-scrobble-display__music-bar"
      />

      <template #popper>
        <header class="c-scrobble-display__header">
          <h2
            class="c-scrobble-display__headline"
            v-text="
              __(lang?.locale, 'scrobble_display.headline', {
                count: numberOfDisplayedTracks,
              })
            "
          />

          <button v-close-popper class="c-scrobble-display__close">
            <X
              :size="14"
              :aria-label="__(lang?.locale, 'scrobble_display.close')"
            />
          </button>
        </header>
        <p v-html="__(lang?.locale, 'scrobble_display.text')" />

        <!-- <TransitionGroup
          name="list"
          tag="div"
          mode="out-in"
          class="c-scrobble-display__list"
        > -->
        <div v-auto-animate class="c-scrobble-display__list">
          <div
            v-for="track in state.tracks.recenttracks.track"
            :key="track"
            class="c-scrobble-display__track-item"
            :class="{ 'is-playing': track['@attr']?.nowplaying }"
          >
            <img
              :src="track.image[1]['#text']"
              :alt="
                __(lang?.locale, 'scrobble_display.album_cover.alt', {
                  album: track.album['#text'],
                  artist: track.artist['#text'],
                })
              "
              class="c-scrobble-display__image"
              decoding="async"
              loading="eager"
              width="64"
              height="64"
            />
            <div class="c-scrobble-display__track">
              <a :href="track.url" class="c-scrobble-display__track-link">{{
                track.name
              }}</a>
              <MusicBars
                v-if="track['@attr']?.nowplaying"
                :animate="true"
                class="c-scrobble-display__now-playing"
              />
            </div>

            <p class="c-scrobble-display__artist">
              {{ track.artist["#text"] }}
            </p>
          </div>
        </div>
        <!-- </TransitionGroup> -->
        <footer>
          <img
            src="/assets/lastfm_scrobble.svg"
            alt="Last.fm Logo"
            class="c-scrobble-display__scrobble"
            width="32"
            height="32"
          />
          <span>{{
            __(lang?.locale, "scrobble_display.total_text", {
              total: state.tracks.recenttracks["@attr"].total,
            })
          }}</span
          ><br />
          <span
            v-html="
              __(lang?.locale, 'scrobble_display.follow_me', {
                link: `https://www.last.fm/user/${state.tracks.recenttracks['@attr'].user}`,
              })
            "
          />
        </footer>
      </template>
    </VDropdown>
  </div>
</template>

<script setup lang="ts">
import { watchEffect, onBeforeUnmount, onMounted, reactive, watch } from "vue";
import MusicBars from "./MusicBars.vue";
import { X } from "lucide-vue-next";
import { __ } from "@i18n/i18n";
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";

export interface ScrobbleDisplayProps {
  numberOfDisplayedTracks?: number;
  updateRate?: number;
  dropdownPlacement?: string;
  idleIfInactive?: boolean;
  idleAfterCount?: number;
  scrobbleApi: string;
}

interface LastFmData {
  recenttracks: {
    track: {
      [x: string]: { nowplaying: boolean };
    }[];
  };
}

interface State {
  tracks: {
    [key: string]: any;
  };
  scrobbling: boolean;
  updateCount: number;
  updateIntervalId: NodeJS.Timer | undefined;
  isDropdownShown: boolean;
  idleAfterCount: number | undefined;
}

// eslint-disable-next-line vue/no-setup-props-destructure
const {
  numberOfDisplayedTracks = 5,
  updateRate = 180_000, // check every 180 seconds (3 min)
  dropdownPlacement = "auto",
  idleIfInactive = false,
  idleAfterCount = undefined, // if idleAfterCount is equal to the current update count, the background update task will stop
  scrobbleApi,
} = defineProps<ScrobbleDisplayProps>();

const state: State = reactive({
  tracks: {},
  scrobbling: false,
  updateCount: 0,
  updateIntervalId: undefined,
  isDropdownShown: false,
  idleAfterCount: idleAfterCount ? idleAfterCount + 1 : undefined,
});

const lang = useStore(currentLanguage);

const stop = watchEffect(() => {
  /**
   * Idle all API calls if the idleAfterCount is equal to the current update count and dropdown is not shown
   */
  if (state.idleAfterCount === state.updateCount && !state.isDropdownShown) {
    stopScrobbleUpdates();
  }
});

watch(
  () => state.isDropdownShown,
  () => {
    if (state.isDropdownShown) {
      state.updateCount = 0;

      return startScrobbleUpdates(true);
    }
  },
);

/**
 * Fetch the last tracks from the last.fm api
 *
 * @return  {object}  api response
 */
const getScrobbles = async (): Promise<LastFmData> => {
  const response = await fetch(
    `${scrobbleApi}?limit=${numberOfDisplayedTracks}`,
  );
  return await response.json();
};

/**
 * Checks the API for new scrobbles and updates the state if necessary
 *
 * @return  {void}  [return description]
 */
const checkIfPlaying = async (): Promise<void> => {
  await getScrobbles().then((data) => {
    state.tracks = data;
    state.updateCount++;

    state.scrobbling = !!data.recenttracks.track.find(
      (track: { [x: string]: { nowplaying: boolean } }) =>
        "@attr" in track && track["@attr"].nowplaying,
    );
  });
};

/**
 * Start looking for new scrobbles
 *
 * @param   {boolean}  immediately  make a API call before starting the interval
 *
 * @return  {void}
 */
const startScrobbleUpdates = (immediately: boolean): void => {
  // Immediately init API call
  if (immediately) checkIfPlaying();

  // Start update interval
  state.updateIntervalId = setInterval(checkIfPlaying, updateRate);
};

/**
 * stop looking for new scrobbles
 *
 * @return  {void}
 */
const stopScrobbleUpdates = (): void => {
  if (typeof state.updateIntervalId !== "undefined")
    clearInterval(state.updateIntervalId);
};

onMounted(async () => {
  startScrobbleUpdates(true);
});

onBeforeUnmount(() => {
  stopScrobbleUpdates();

  stop();
});
</script>

<style lang="scss">
@use "@styles/components/scrobble-display";
</style>
