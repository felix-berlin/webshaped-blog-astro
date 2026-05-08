import * as Sentry from "@sentry/astro";
import { loadEnv } from "vite";

const { SENTRY_DSN } = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "");
const { version } = await import("./package.json");

Sentry.init({
  dsn: SENTRY_DSN,
  release: version,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
