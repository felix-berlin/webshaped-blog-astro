<template>
  <div class="c-scrobble-display">
    <VDropdown
      v-model:shown="state.isDropdownShown"
      popper-class="c-scrobble-display__dropdown"
      :show-triggers="['hover']"
      :placement="dropdownPlacement"
      :distance="10"
    >
      <MusicBars
        :animate="state.scrobbling"
        class="c-scrobble-display__music-bar"
      />

      <template
        #popper
      >
        <header class="c-scrobble-display__header">
          <h2 class="c-scrobble-display__headline">
            Meine zuletzt gehörten {{ numberOfDisplayedTracks }} Tracks
          </h2>
          <button
            v-close-popper
            class="c-scrobble-display__close"
          >
            <X
              :size="14"
              aria-label="Track Liste schließen"
            />
          </button>
        </header>
        <p>Ohne Musik geht bei mir gar nichts,<br>deshalb habe 2017 damit angefangen meinem Musikkonsum zu tracken.</p>

        <TransitionGroup
          name="list"
          tag="div"
          mode="out-in"
          class="c-scrobble-display__list"
        >
          <div
            v-for="(track, index) in state.tracks.recenttracks.track"
            :key="index"
            class="c-scrobble-display__track-item"
            :class="{ 'is-playing': track['@attr']?.nowplaying}"
          >
            <img
              :src="track.image[1]['#text']"
              :alt="`Albumcover: ${track.album['#text']}`"
              class="c-scrobble-display__image"
              decoding="async"
              loading="eager"
              width="64"
              height="64"
            >
            <div class="c-scrobble-display__track">
              <a
                :href="track.url"
                class="c-scrobble-display__track-link"
              >{{ track.name }}</a>
              <MusicBars
                v-if="track['@attr']?.nowplaying"
                :animate="true"
                class="c-scrobble-display__now-playing"
              />
            </div>

            <p class="c-scrobble-display__artist">
              {{ track.artist['#text'] }}
            </p>
          </div>
        </TransitionGroup>
        <footer>
          <img
            src="/assets/lastfm_scrobble.svg"
            alt="Last.fm Logo"
            class="c-scrobble-display__scrobble"
            width="32"
            height="32"
          >
          <span>Seit 2017 habe ich {{ state.tracks.recenttracks['@attr'].total }} Tracks gehört.</span><br>
          <span>Folge mir auf <a
            :href="`https://www.last.fm/user/${state.tracks.recenttracks['@attr'].user}`"
            target="_blank"
          >LastFM</a></span>
        </footer>
      </template>
    </vDropdown>
  </div>
</template>

<script setup lang="ts">
import { watchEffect, onBeforeUnmount, onMounted, reactive, watch  } from "vue";
import MusicBars from "./MusicBars.vue";
import { X } from 'lucide-vue-next';

export interface ScrobbleDisplayProps {
  numberOfDisplayedTracks?: number;
  updateRate?: number;
  dropdownPlacement?: string;
  idleIfInactive?: boolean;
  idleAfterCount?: number;
}

interface State {
  tracks: object;
  scrobbling: boolean;
  updateCount: number;
  updateIntervalId: NodeJS.Timer | undefined;
  isDropdownShown: boolean;
  idleAfterCount: number | undefined;
}

const props = withDefaults(defineProps<ScrobbleDisplayProps>(), {
  numberOfDisplayedTracks: 5,
  updateRate: 180000, // check every 180 seconds (3 min)
  dropdownPlacement: 'left',
  idleIfInactive: false,
  idleAfterCount: undefined, // if idleAfterCount is equal to the current update count, the background update task will stop
});

const state: State = reactive({
  tracks: {},
  scrobbling: false,
  updateCount: 0,
  updateIntervalId: undefined,
  isDropdownShown: false,
  idleAfterCount: props.idleAfterCount ? props.idleAfterCount + 1 : undefined,
})

const stop = watchEffect(() => {
  /**
   * Idle all API calls if the idleAfterCount is equal to the current update count and dropdown is not shown
   */
  if (state.idleAfterCount === state.updateCount && !state.isDropdownShown) {
    stopScrobbleUpdates();
  }
})

watch (
  () => state.isDropdownShown,
  () => {
    if (state.isDropdownShown) {
      state.updateCount = 0;

      return startScrobbleUpdates(true);
    }
  }
)

/**
 * Fetch the last tracks from the last.fm api
 *
 * @return  {object}  api response
 */
const getScrobbles = async (): Promise<object> => {
  const response = await fetch(`${import.meta.env.PUBLIC_LAST_FM_SCROBBLER_API}?limit=${ props.numberOfDisplayedTracks }`);
  const data = await response.json();

  return data;
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
      (track: { [x: string]: { nowplaying: boolean; }; hasOwnProperty: (arg0: string) => any; }) =>
      track.hasOwnProperty('@attr') && track['@attr'].nowplaying);
  });
}

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
  state.updateIntervalId = setInterval(checkIfPlaying, props.updateRate);
}

/**
 * stop looking for new scrobbles
 *
 * @return  {void}
 */
const stopScrobbleUpdates = (): void => {
  if (typeof state.updateIntervalId !== 'undefined') clearInterval(state.updateIntervalId);
}

onMounted( async () => {
  startScrobbleUpdates(true);

});

onBeforeUnmount(() => {
  stopScrobbleUpdates();

  stop();
});
</script>

<style lang="scss">
@use '@styles/components/scrobble-display';
</style>
