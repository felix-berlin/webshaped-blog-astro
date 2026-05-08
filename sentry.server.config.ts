import * as Sentry from "@sentry/astro";

const SENTRY_DSN = process.env.SENTRY_DSN || import.meta.env.SENTRY_DSN;
const { version } = await import("./package.json");

Sentry.init({
  dsn: SENTRY_DSN,
  release: version,
  tracesSampleRate: 1.0,
});
