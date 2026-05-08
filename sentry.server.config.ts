import * as Sentry from "@sentry/astro";
import { loadEnv } from "vite";

const { SENTRY_DSN } = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "");
const { version } = await import("./package.json");

Sentry.init({
  dsn: SENTRY_DSN,
  release: version,
  tracesSampleRate: 1.0,
});
