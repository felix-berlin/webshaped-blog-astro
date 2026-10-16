<template>
  <div class="c-scrobble-display">
    <VDropdown
      v-model:shown="isDropdownShown"
      popper-class="c-scrobble-display__dropdown"
      :placement="dropdownPlacement"
      :distance="10"
    >
      <MusicBars :animate="scrobbling" class="c-scrobble-display__music-bar" />

      <template #popper>
        <header class="c-scrobble-display__header">
          <h2
            class="c-scrobble-display__headline"
            v-text="
              t('scrobble_display.headline', {
                count: numberOfDisplayedTracks,
              })
            "
          />

          <button v-close-popper class="c-scrobble-display__close">
            <X width="14" height="14" :aria-label="t('scrobble_display.close')" />
          </button>
        </header>
        <p v-html="t('scrobble_display.text')" />

        <div v-if="tracks.recenttracks?.track" v-auto-animate class="c-scrobble-display__list">
          <div
            v-for="track in tracks.recenttracks.track"
            :key="track.url"
            class="c-scrobble-display__track-item"
            :class="{ 'is-playing': track['@attr']?.nowplaying }"
          >
            <img
              :src="track.image[1]['#text']"
              :alt="
                t('scrobble_display.album_cover.alt', {
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
              <a :href="track.url" class="c-scrobble-display__track-link">{{ track.name }}</a>
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
        <footer>
          <IconBrandLastfm class="c-scrobble-display__scrobble" width="25" height="25" />
          <span>{{
            t("scrobble_display.total_text", {
              total: tracks.recenttracks?.["@attr"]?.total ?? "",
            })
          }}</span
          ><br />
          <span
            v-html="
              t('scrobble_display.follow_me', {
                link: `https://www.last.fm/user/${tracks.recenttracks?.['@attr']?.user}`,
              })
            "
          />
        </footer>
      </template>
    </VDropdown>
  </div>
</template>

<script setup lang="ts">
import type { Lang } from "@i18n/ui";

import { useIntervalFn } from "@vueuse/core";
import X from "virtual:icons/lucide/x";
import IconBrandLastfm from "virtual:icons/tabler/brand-lastfm";
import { computed, ref, watch } from "vue";

import { useI18n } from "@/composables/useI18n";

import MusicBars from "./MusicBars.vue";

export interface ScrobbleDisplayProps {
  dropdownPlacement?: string;
  /** Stop polling after this many background updates while the dropdown is closed. */
  idleAfterCount?: number;
  lang: Lang;
  numberOfDisplayedTracks?: number;
  scrobbleApi?: string;
  updateRate?: number;
}

interface LastFmData {
  recenttracks: {
    "@attr"?: {
      total?: string;
      user?: string;
    };
    track: LastFmTrack[];
  };
}

interface LastFmTrack {
  "@attr"?: {
    nowplaying?: string;
  };
  album: {
    "#text": string;
  };
  artist: {
    "#text": string;
  };
  image: Array<{
    "#text": string;
  }>;
  name: string;
  url: string;
}

const {
  dropdownPlacement = "auto",
  idleAfterCount,
  lang,
  numberOfDisplayedTracks = 5,
  scrobbleApi = "",
  updateRate = 180_000, // check every 180 seconds (3 min)
} = defineProps<ScrobbleDisplayProps>();

const { t } = useI18n(() => lang);

const tracks = ref<Partial<LastFmData>>({});
const isDropdownShown = ref(false);
const updateCount = ref(0);
// The initial fetch counts as an update, so idle after one more than requested.
const idleAt = idleAfterCount ? idleAfterCount + 1 : undefined;

const scrobbling = computed(
  () => !!tracks.value.recenttracks?.track.some((track) => !!track["@attr"]?.nowplaying),
);

const checkIfPlaying = async (): Promise<void> => {
  const response = await fetch(`${scrobbleApi}?limit=${numberOfDisplayedTracks}`);
  tracks.value = await response.json();
  updateCount.value++;
};

// Fetches immediately, then every `updateRate` ms; `resume()` restarts both.
const { pause, resume } = useIntervalFn(checkIfPlaying, updateRate, { immediateCallback: true });

watch([updateCount, isDropdownShown], ([count, shown]) => {
  if (count === idleAt && !shown) pause();
});

watch(isDropdownShown, (shown) => {
  if (!shown) return;
  updateCount.value = 0;
  resume();
});
</script>

<style lang="scss">
@use "@styles/components/scrobble-display";
</style>
