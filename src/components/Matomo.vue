<!-- eslint-disable-next-line vue/valid-template-root -->
<template />

<script setup lang="ts">
import { onMounted } from "vue";

export interface MatomoProps {
  siteId?: string | null;
  host?: string | null;
  cookieDomain?: string | null;
  debugMode?: boolean;
}

const props = withDefaults(defineProps<MatomoProps>(), {
  siteId: null,
  host: null,
  cookieDomain: null,
  debugMode: false,
});

const initMatomo = () => {
  const _paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['disableCookies']);
  _paq.push(['enableHeartBeatTimer', 5]);
  _paq.push(['setCookieDomain', props.cookieDomain]);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);

  if (props.debugMode) {
    window._mtm = window._mtm || [];
    window._mtm.push(['enableDebugMode']);
  }

  (function() {
    const u = `https://${props.host}/`;
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', props.siteId]);
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];

    g.id = 'matomo-script';

    g.type = 'text/javascript';
    g.async = true;
    g.defer = true;
    g.src = u + 'matomo.js';
    s.parentNode.insertBefore(g, s);
  })();
};

const removeMatomo = () => {
  const script = document.getElementById('matomo-script');
  if (script) {
    script.remove();
  }
};

onMounted(() => {
    initMatomo();
});

</script>
