<template>
  <div>
    <VDropdown>
      <MusicBars :animate="state.scrobbling" />

      <template
        #popper
      >
        <ol>
          <li
            v-for="(track, index) in state.tracks.recenttracks.track"
            :key="index"
            :class="{ 'is-playing': track['@attr']?.nowplaying}"
          >
            <img
              :src="track.image[1]['#text']"
              :alt="track.album['#text']"
              decoding="async"
              loading="eager"
              width="64"
              height="64"
            >
            <p>{{ track.name }}</p>
            <p>{{ track.artist['#text'] }}</p>
            <Music v-if="track['@attr']?.nowplaying" />
          </li>
        </ol>
      </template>
    </VDropdown>
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
  }, 90000);
});
</script>

<style scoped>

</style>
