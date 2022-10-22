<template>
  <div class="c-scrobble-display">
    <VDropdown
      popper-class="c-scrobble-display__dropdown"
      :show-triggers="['hover']"
      :placement="dropdownPlacement"
    >
      <MusicBars
        :animate="state.scrobbling"
        class="c-scrobble-display__music-bar"
      />

      <template
        #popper
      >
        <p>Ohne Musik geht bei mir gar nichts,<br>deshalb habe 2017 damit angefangen meinem Musikkonsum zu tracken.<br>Hier siehst du meine zuletzt gehörten {{ numberOfDisplayedTracks }} Tracks.</p>
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
          <span>Seit 2017 gehört: {{ state.tracks.recenttracks['@attr'].total }}</span><br>
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
import { onBeforeMount, onBeforeUnmount, onMounted, reactive } from "vue";
import MusicBars from "./MusicBars.vue";
import { Music } from 'lucide-vue-next';

export interface ScrobbleDisplayProps {
  numberOfDisplayedTracks?: number;
  updateRate?: number;
  updateIfActive?: boolean;
  dropdownPlacement?: string;
}

const props = withDefaults(defineProps<ScrobbleDisplayProps>(), {
  numberOfDisplayedTracks: 5,
  updateRate: 180000, // check every 180 seconds (3 min)
  updateIfActive: false,
  dropdownPlacement: 'left',
});

const state = reactive({
  tracks: {},
  scrobbling: false,
})

let updateIntervalId: NodeJS.Timer | undefined;

const getScrobbles = async () => {
  const response = await fetch(`${import.meta.env.PUBLIC_LAST_FM_SCROBBLER_API}?limit=${ props.numberOfDisplayedTracks }`);
  const data = await response.json();

  return data;
};

const checkIfPlaying = async () => {
  await getScrobbles().then((data) => {
    state.tracks = data;

    state.scrobbling = !!data.recenttracks.track.find((track: { [x: string]: { nowplaying: boolean; }; hasOwnProperty: (arg0: string) => any; }) => track.hasOwnProperty('@attr') && track['@attr'].nowplaying);
  });
}

onMounted( async () => {
  await checkIfPlaying();

  if (!props.updateIfActive) {
    updateIntervalId = setInterval(checkIfPlaying, props.updateRate);
  }
});

onBeforeUnmount(() => {
  clearInterval(updateIntervalId);
});
</script>

<style lang="scss">
@use '@styles/components/scrobble-display';
</style>
