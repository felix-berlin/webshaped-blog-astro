import * as Sentry from "@sentry/astro";

const SENTRY_DSN = process.env.SENTRY_DSN || import.meta.env.SENTRY_DSN;
const { version } = await import("./package.json");

Sentry.init({
  dsn: SENTRY_DSN,
  release: version,
  tracesSampleRate: 1.0,
  // v11 defaults to collecting user info, cookies, and request/response bodies; keep v10's restrictive behavior.
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpBodies: [],
    databaseQueryData: false,
  },
});
