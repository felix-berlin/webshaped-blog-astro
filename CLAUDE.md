# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                  # Start dev server (runs gql:generate first via predev hook)
pnpm build                # Production build
pnpm build:strict         # Build + full type check (astro check + tsc + vue-tsc) — CI standard
pnpm typechecking         # Type-check without building

pnpm lint                 # oxlint (JS/TS) + stylelint (SCSS)
pnpm format               # oxfmt formatter

pnpm test:unit            # Vitest watch mode
pnpm test:unit:coverage   # With V8 coverage
pnpm test:e2e             # Playwright (Chromium, Firefox, WebKit)

pnpm gql:generate         # Regenerate GraphQL types from live WordPress schema
```

**Always use `pnpm`** — a `preinstall` hook blocks npm/yarn.

To run a single unit test file: `pnpm test:unit src/tests/unit/path/to/file.test.ts`

## Environment Setup

Copy `.env.example` to both `.env` and `.env.runtime`. The `.env.runtime` file enables [Astro runtime environment variables](https://docs.astro.build/en/guides/integrations-guide/node/#runtime-environment-variables) for SSR.

| Variable                | Description                             |
| ----------------------- | --------------------------------------- |
| `WP_API`                | WordPress GraphQL endpoint URL (required for `gql:generate`) |
| `WP_REST_API`           | WordPress REST API URL                  |
| `WP_AUTH_REFRESH_TOKEN` | Server-side GraphQL auth token (secret) |
| `LAST_FM_SCROBBLER_API` | Music scrobbling API URL                |
| `SITE_URL`              | Site base URL (used by sitemap)         |
| `ENABLE_ANALYTICS`      | `true`/`false` to enable Matomo         |
| `GITHUB_TOKEN`          | GitHub API access (server-side, required) |

## Architecture

Personal blog frontend: **Astro 6 (SSR)** + **Vue 3 islands**, backed by a **WordPress GraphQL API**.

### Astro vs Vue

- **Astro (`.astro`)** — layouts, static markup, meta tags, page shells. Zero JS by default.
- **Vue (`.vue`)** — interactive islands: toggles, forms, modals, search, comments.

Do not add client-side state or interactivity to `.astro` components — create a Vue component instead.

### Directory Structure

| Directory            | Purpose                                                             |
| -------------------- | ------------------------------------------------------------------- |
| `src/pages/`         | File-based routing; `[lang]/` for i18n, `api/` for server endpoints |
| `src/components/`    | Mixed Vue + Astro components                                        |
| `src/layouts/`       | Page wrappers (`DefaultLayout`, `BlogPost`)                         |
| `src/features/`      | Feature modules with co-located components, types, and services     |
| `src/stores/`        | Nanostores atoms (`store.ts`) and i18n store (`i18n.ts`)            |
| `src/composables/`   | Vue composables (e.g., `useI18n`)                                   |
| `src/services/`      | GraphQL queries/mutations + fetch utilities                         |
| `src/gql/`           | **Auto-generated — never edit manually**                            |
| `src/utils/i18n/`    | Translation helpers (`getLangFromUrl`, `useTranslations`)           |
| `src/styles/`        | Global SCSS (ITCSS: base, components, objects, utilities)           |
| `src/content/`       | Astro content collections — only locale JSON files                  |
| `src/tests/`         | Unit tests (`unit/`), E2E tests (`e2e/`), MSW mocks                 |

**Blog posts come from WordPress GraphQL, not Astro content collections.**

### Path Aliases

```typescript
@components/*   → src/components/*
@composables/*  → src/composables/*
@stores/*       → src/stores/*
@services/*     → src/services/*
@i18n/*         → src/utils/i18n/*
```

### SCSS Aliases

```scss
@sass-butler/*  → node_modules/@felix_berlin/sass-butler/
@styles/*       → src/styles/
```

## GraphQL Workflow

Types in `src/gql/` are auto-generated — never edit them.

1. Define queries/mutations in `src/services/` using the `graphql()` tag function.
2. Run `pnpm gql:generate` to regenerate `src/gql/` (requires `WP_API` in `.env`).
3. `pnpm dev` does this automatically via the `predev` hook.

Fragment masking is enabled — components can only access fields defined in their own fragment.

## i18n

- Languages: `de` (default), `en`
- URL structure: `/de/...` and `/en/...`
- Locale files: `src/content/i18n/de-DE.json` and `en-US.json`
- In Astro: `getLangFromUrl(url)` + `useTranslations(lang)` from `@i18n/utils`
- In Vue: `useI18n()` composable from `@composables/useI18n`

## State Management

Nanostores atoms in `src/stores/store.ts`: `currentLanguage`, `isDarkMode` (persistent), `loadingState`, `guest` (persistent — comment form data).

```typescript
import { useStore } from "@nanostores/vue";
const isDark = useStore(isDarkMode); // reactive ref
```

Persistent atoms use encode/decode functions for SSR safety — maintain this pattern for new persistent atoms.

## Styling

- Global SCSS entry: `src/styles/app.scss` (imported in `DefaultLayout`)
- Dark mode: `.dark` class on `<html>` — not CSS custom properties
- Sass utility library: `@felix_berlin/sass-butler` (imported via `@sass-butler/*`)

## Testing

- **Unit tests**: `src/tests/unit/**/*.{test,spec}.ts` — Vitest + Vue Test Utils + jsdom
- **E2E tests**: `tests/e2e/` — Playwright (Chromium, Firefox, WebKit)
- **Mocking**: MSW in `src/tests/mocks/node.ts`; setup in `src/tests/setup.ts`
- Coverage excludes `src/gql/**` and `src/types/**`

## Non-Obvious Pitfalls

- **`src/gql/` is fully auto-generated** — changes will be overwritten by `gql:generate`.
- **`pnpm gql:generate` requires `WP_API`** — codegen fetches the live schema; will fail without it.
- **Dark mode is class-based** (`.dark` on `<html>`), not CSS variables.
- **PWA is disabled** (commented out in `astro.config.mjs`) — do not re-enable; `@vite-pwa/astro` is not compatible with Astro 6.
- **`pnpm build:strict` is the CI standard** — always type-check before considering a build complete.
- **`@codecov/astro-plugin`** is not compatible with `@vite-pwa/astro` — keep PWA disabled or migrate to direct Vite plugins.
