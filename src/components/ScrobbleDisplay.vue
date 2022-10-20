<template>
  <div class="c-scrobble-display">
    <VDropdown popper-class="c-scrobble-display__dropdown">
      <MusicBars
        :animate="state.scrobbling"
        class="c-scrobble-display__music-bar"
      />

      <template
        #popper
      >
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
      </template>
    </vDropdown>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, reactive } from "vue";
import MusicBars from "./MusicBars.vue";
import { Music } from 'lucide-vue-next';

const state = reactive({
  tracks: {},
  scrobbling: false,
})

const getScrobbles = async () => {
  const response = await fetch(`${import.meta.env.PUBLIC_LAST_FM_SCROBBLER_API}?limit=5`);
  const data = await response.json();

  return data;
};

const checkIfPlaying = async () => {
  await getScrobbles().then((data) => {
    state.tracks = data;

    state.scrobbling = data.recenttracks.track.find((track: { [x: string]: { nowplaying: boolean; }; hasOwnProperty: (arg0: string) => any; }) => track.hasOwnProperty('@attr') && track['@attr'].nowplaying);
  });
}

onMounted( async () => {
  await checkIfPlaying();

  setInterval(async () => {
    await checkIfPlaying();
  }, 90000); // check every 90 seconds (1.5 min)
});
</script>

<style lang="scss">
@use '@styles/components/scrobble-display';
</style>
