# Webshaped Blog — Agent Instructions

Personal blog frontend built with **Astro 5 (SSR) + Vue 3 islands**, backed by a **WordPress GraphQL API**.

## Key Commands

```bash
pnpm dev              # Start dev server (auto-runs gql:generate first via predev hook)
pnpm build            # Production build
pnpm build:strict     # Build + full type check (astro check, tsc, vue-tsc)
pnpm typechecking     # Type-check without building

pnpm lint             # ESLint + Stylelint
pnpm format           # Oxfmt formatter

pnpm test:unit        # Vitest (watch mode)
pnpm test:unit:coverage  # With coverage
pnpm test:e2e         # Playwright

pnpm gql:generate     # Regenerate GraphQL types from schema
```

**Always use `pnpm` — not npm or yarn** (`preinstall` hook enforces this).

## Environment Setup

Copy `.env.example` to `.env` and `.env.runtime`. Required variables:

| Variable                | Description                             |
| ----------------------- | --------------------------------------- |
| `WP_API`                | WordPress GraphQL endpoint URL          |
| `WP_REST_API`           | WordPress REST API URL                  |
| `WP_AUTH_REFRESH_TOKEN` | Server-side GraphQL auth token (secret) |
| `LAST_FM_SCROBBLER_API` | Music scrobbling API URL                |
| `SITE_URL`              | Site base URL (used by sitemap)         |
| `ENABLE_ANALYTICS`      | `true`/`false` to enable Matomo         |

`.env.runtime` enables [Astro runtime environment variables](https://docs.astro.build/en/guides/integrations-guide/node/#runtime-environment-variables) for SSR.

## Architecture

### Astro vs Vue Components

- **Astro (`.astro`)** — layouts, static markup, meta tags, page shells. Zero JS by default.
- **Vue (`.vue`)** — interactive islands: toggles, forms, modals, search, comment system.

Do not add client-side state or interactivity to Astro components; create a Vue component instead.

### Directory Map

| Directory          | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `src/pages/`       | File-based routing; `[lang]/` for i18n, `api/` for server endpoints |
| `src/components/`  | Mixed Vue + Astro components                                        |
| `src/layouts/`     | Page wrappers (`DefaultLayout`, `BlogPost`)                         |
| `src/features/`    | Feature modules with co-located components, types, and services     |
| `src/stores/`      | Nanostores atoms (`store.ts`) and i18n store (`i18n.ts`)            |
| `src/composables/` | Vue composables (e.g., `useI18n`)                                   |
| `src/services/`    | GraphQL queries/mutations + fetch utilities                         |
| `src/gql/`         | **Auto-generated** — DO NOT EDIT manually                           |
| `src/utils/i18n/`  | Translation helpers (`getLangFromUrl`, `useTranslations`)           |
| `src/styles/`      | Global SCSS (ITCSS pattern: base, components, objects, utilities)   |
| `src/content/`     | Astro content collections — only locale JSON files                  |
| `src/tests/`       | Unit tests (`unit/`), E2E tests (`e2e/`), MSW mocks                 |

**Blog posts come from WordPress GraphQL, not Astro content collections.**

### Path Aliases (tsconfig)

```typescript
@components/*   → src/components/*
@composables/*  → src/composables/*
@stores/*       → src/stores/*
@services/*     → src/services/*
@i18n/*         → src/utils/i18n/*
```

## GraphQL Workflow

Types in `src/gql/` are **auto-generated** — never edit them directly.

1. Define queries/mutations in service files using the `graphql()` tag function.
2. Run `pnpm gql:generate` to regenerate `src/gql/`.
3. `pnpm dev` does this automatically via the `predev` hook.

Fragment masking is enabled — components can only access fields defined in their own fragment.

## i18n

- Languages: `de` (default), `en`
- URL structure: `/de/...` and `/en/...`
- Locale files: `src/content/i18n/de-DE.json` and `en-US.json`
- In Astro: use `getLangFromUrl(url)` + `useTranslations(lang)` from `@i18n/utils`
- In Vue: use the `useI18n()` composable from `@composables/useI18n`

## State Management

Nanostores atoms in `src/stores/store.ts`: `currentLanguage`, `isDarkMode` (persistent), `loadingState`, `guest` (persistent — comment form data).

```typescript
import { useStore } from "@nanostores/vue";
const isDark = useStore(isDarkMode); // reactive ref
```

Persistent atoms use encode/decode functions for SSR safety — maintain this pattern when adding new persistent atoms.

## Testing Conventions

- **Unit tests**: `src/tests/unit/**/*.{test,spec}.ts` with Vitest + Vue Test Utils
- **E2E tests**: `tests/e2e/` with Playwright (Chromium, Firefox, WebKit)
- **Mocking**: MSW in `src/tests/mocks/node.ts`; test setup in `src/tests/setup.ts`
- Coverage excludes `src/gql/**` and `src/types/**` (generated/types only)

## Styling

Global SCSS entry: `src/styles/app.scss` (imported in `DefaultLayout`).
Dark mode uses a `.dark` class on `<html>` — not CSS custom property theming.
Sass utility library: `@felix_berlin/sass-butler` (imported as `@sass-butler/*`).

## Non-Obvious Pitfalls

- **`src/gql/` is fully auto-generated** — changes will be overwritten by `gql:generate`.
- **`pnpm gql:generate` requires `WP_API` to be set** — codegen fetches the live schema.
- **Dark mode is class-based** (`.dark` on `<html>`), not CSS variables.
- **PWA is disabled** (commented out in `astro.config.mjs`) — do not re-enable without testing manifest issues.
- **`pnpm build:strict` is the CI standard** — always type-check before considering a build complete.
