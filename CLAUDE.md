# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                  # Start dev server (runs gql:generate first via predev hook)
pnpm agent                # Launch Claude Code sandboxed behind the Infisical agent proxy (see Agent Proxy)
pnpm build                # Production build
pnpm build:strict         # Type check (astro check + tsc + vue-tsc) + build — CI standard
pnpm typechecking         # Type-check without building

pnpm env:load             # Show the resolved config, secrets redacted — start here when a var misbehaves
pnpm env:scan             # Scan the repo for secret values committed in plaintext
pnpm env:encrypt          # Encrypt .env.local at rest (interactive, needs a real TTY)

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

**`.env.schema` is the single source of truth.** It declares every variable —
type, required-ness, and whether the value may reach the browser — and holds no
values. Read it instead of this table; a table in a doc goes stale, a schema that
fails the build does not. There is no `.env.example` and no `envField` block in
`astro.config.mjs` any more; both were replaced by it.

Config is managed by [varlock](https://varlock.dev) via the `@env-spec` DSL:

- **Access in code**: `import { ENV } from "varlock/env"` — never `process.env`,
  never `astro:env`. `ENV.FOO` is typed from the generated `env.d.ts`.
- **Sensitivity is opt-out**: `@defaultSensitive=true`, so a new variable is
  secret until someone writes `@sensitive=false` on it. Only non-sensitive items
  reach the client bundle, so the dangerous direction requires a deliberate,
  reviewable line.
- **Booleans are real booleans** — `@type=boolean` coerces, so no `=== "true"`.
- **Adding a variable**: add it to `.env.schema`, add the value in Infisical.
  Nothing else; `env.d.ts` regenerates on the next varlock run.

`env.d.ts` is generated and gitignored. `.env.test` is committed and deliberately
fake — it lets the unit suite run with no credentials at all.

## Secrets

Values live in [Infisical](https://infisical.com) (self-hosted at `https://infisical.kasimir.dev`, project `web-shaped`). varlock fetches them via `@initInfisical()` in `.env.schema` and injects them into the child process — every script is wrapped in `varlock run --`, so there is no longer a "with secrets" and a "without secrets" variant of the build.

**Precedence: an existing environment variable always wins over the `infisical()` resolver.** That is what makes the same schema work everywhere — CI and Docker supply values through the environment and never reach Infisical, while a workstation resolves them live.

### Two auth paths, one schema

varlock prefers **Universal Auth** when `INFISICAL_CLIENT_ID`/`INFISICAL_CLIENT_SECRET` are set and falls back to **OIDC** via `identityId` when they are empty (verified 2026-07-31). That is what lets the same `.env.schema` serve both:

| Where          | Identity                    | Method                                       |
| -------------- | --------------------------- | -------------------------------------------- |
| GitHub Actions | `github-actions-web-shaped` | OIDC — needs `permissions: id-token: write`  |
| Workstation    | `local-dev-web-shaped`      | Universal Auth via `.env.local` (gitignored) |

**CI needs no credentials at all.** `docker-build.yml` and `docker-smoke-test.yml` therefore have no `Infisical/secrets-action` step; they run `pnpm exec varlock run -- scripts/write-build-env.sh`, and varlock authenticates itself. `APP_ENV` (set from the branch/tag in the workflow) picks the Infisical environment. `unit-test.yml` deliberately keeps the action — it only needs `CODECOV_TOKEN`, and the tests themselves run off `.env.test` with no secrets.

**Setting up a workstation is documented in [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)** — creating the machine identity, storing its credential encrypted at rest via `pnpm env:encrypt`, and a troubleshooting table. None of it is required: without `.env.local`, prefix any command with `infisical run --env=dev --` and everything works, because an existing environment variable beats the resolver.

`.env.local` holds a real credential even though varlock encrypts it — it stays gitignored and unreadable to agents.

`APP_ENV` selects both the Infisical environment and which `.env.[env]` file loads: `dev` (default), `prod`, or `test`. `test` resolves entirely from the committed `.env.test`, so unit tests never touch Infisical.

`pnpm env:scan` only means something when it runs against **real** values — it works by searching the repo for the resolved secrets. Run it under `APP_ENV=test` and it just finds the fakes in `.env.test` and reports 5 hits; that is the scanner working, not a leak.

### Guard against plaintext secret reads

`.claude/hooks/no-plaintext-secrets.py` runs as a `PreToolUse` hook on Bash, Read, Grep and Glob, and **denies** two ways of putting credentials verbatim into the agent transcript:

- **Infisical reads** — `infisical secrets`, `infisical export`, `--plain`. `infisical run -- <cmd>` and `infisical secrets agent-proxy …` stay allowed, so nothing in the workflow above is affected.
- **Dotenv files** — reading `.env`, `.env.runtime`, `.build.env` and friends. Only content-printing commands are blocked (`cat`, `head`, `grep`, `source`, …); `rm -f .env`, `ls -la .env` and `printf … > .env` are routine and stay allowed. `.env.schema` and `.env.test` hold no real values and remain readable — the schema is where variable names belong.

Judged per shell segment, so `head .env.schema && rm -f .env` is not mistaken for a leak. It is pattern matching, not a sandbox: `grep -r secret .` still reaches `.env` without naming it. It stops the accidental read, not a determined one.

Written after exactly that leak on 2026-07-31 (twice — Infisical values, then a failed redaction of a dotenv dump); a note in this file did not prevent it, a hook does. Checks: `.claude/hooks/no-plaintext-secrets.test.sh`.

### CI (GitHub Actions)

`unit-test.yml` and `docker-build.yml` fetch secrets directly from Infisical via GitHub OIDC (no GitHub Secrets needed for app-level vars — `Infisical/secrets-action`). Environment selection: `main`/tag pushes → `prod`, everything else → `dev`. The branch half matches `.infisical.json`'s `gitBranchToEnvironmentMapping`; the tag rule exists only in the workflows.

`docker-build.yml` fetches secrets into the runner's env, then writes them into `.build.env`, which is handed to `docker buildx build` as a BuildKit secret file (`secret-files: build_env=.build.env`) — Docker itself never talks to Infisical directly, since BuildKit has no equivalent of GitHub's OIDC token exchange.

### Local/self-hosted deployment (`compose.yaml`)

`compose.yaml` builds and runs the app via plain files (`BUILD_ENV_FILE` for the build secret, `env_file: .env` for the running container) — it doesn't call Infisical itself. It brings up two containers: `app` (Node adapter on 4321, `expose`d only) behind `proxy` (nginx on `${HOST_PORT:-80}`), each with a healthcheck.

**The two env files are not interchangeable.** The Dockerfile `source`s the build secret in a shell, so values need `%q` quoting; Compose's `env_file` parses literally and would keep those backslashes. `WP_AUTH_PASS` is a WordPress Application Password with spaces, so getting this wrong truncates it at the first space. `scripts/write-build-env.sh` writes both formats and fails loudly on any empty required var:

```bash
infisical run --env=prod -- scripts/write-build-env.sh .build.env quoted   # sourced by the Dockerfile
infisical run --env=prod -- scripts/write-build-env.sh .env raw            # parsed by env_file
BUILD_ENV_FILE=.build.env docker compose up --build
```

Verify, then tear down — both files hold real production secrets:

```bash
docker compose ps                      # both services should report (healthy)
curl -f http://localhost:${HOST_PORT:-80}/
docker compose logs app | grep -i "error\|unauthenticated"
docker compose down && rm -f .env .build.env
```

Notes:

- A successful build prerenders the static routes and runs Pagefind; the WordPress credentials are needed **at build time** for that, not just at runtime.
- Missing or empty required vars fail the build inside Docker with Astro's `EnvInvalidVariables` — that is the env schema working, not a bug.
- `docker-build.yml` passes `BUILD_ENV_HASH` to bust the build cache when only secret _values_ change. Compose does not, so add `--no-cache` locally if you rotate a credential without touching a file.

### Agent Proxy (AI agents)

`pnpm agent` runs Claude Code behind the Infisical agent proxy: the agent gets **placeholder** credentials in its environment, the proxy swaps in the real values as requests leave, and a bubblewrap sandbox keeps the agent out of `~/.ssh`, `~/.infisical`, and the keyring. A leaked agent context then leaks nothing usable. `run` brokers as the logged-in user — no machine identity involved.

Proxied services configured in `dev` at path `/` (verified working):

| Service     | Host pattern               | Mechanism                                         |
| ----------- | -------------------------- | ------------------------------------------------- |
| `github`    | `api.github.com`           | Secret substitution, placeholder `GITHUB_TOKEN`   |
| `wordpress` | `cms.webshaped.de/graphql` | Header rewrite, Basic Auth `WP_AUTH_USER`/`_PASS` |
| `sentry`    | `sentry.io`                | Header rewrite, Bearer `SENTRY_AUTH_TOKEN`        |

The `--set-env WP_AUTH_*=x` dummies in the script exist because the env scrub drops those names, and `.env.schema` marks them `@required` — the real credential comes from the proxy, varlock just needs the schema satisfied.

**Verified end to end on 2026-08-02** with CLI 0.43.116 (the sandboxed `run` mode needs ≥ 0.43.115). Inside the sandbox, `GITHUB_TOKEN` is a 40-character placeholder; a request carrying it to `api.github.com` came back `200`, and a `POST` to the WPGraphQL endpoint returned real data rather than the maintenance page. The real values never entered the agent's environment.

One gap: the CLI warns `cannot report proxied-service usage … needs the Report Usage permission on proxied services` (403). Harmless — only the service's last-used timestamp stops updating — but grant that permission if you rely on it for auditing.

Useful flags beyond what `pnpm agent` sets: `--unmatched-host block` turns the proxy from advisory into an allowlist, `--allow-host` opens a single exception, and `--log-file` keeps the activity log somewhere you can read it afterwards.

Known limits on WSL2:

- **No network isolation** — a private network namespace is unavailable, so `run` falls back to shared networking. Routing through the proxy is advisory: a tool that ignores `HTTP_PROXY` reaches the network directly. Credential protections are unaffected.
- **Credential paths must not be symlinks.** `~/.aws` and `~/.azure` pointed into `/mnt/c`; bwrap could not mount its deny-tmpfs over them and refused to start. Fixed by replacing them with real directories — do not re-link them.
- **No Infisical token inside the sandbox** (deliberate), so `pnpm dev` and `pnpm gql:generate` cannot resolve values there — varlock reaches Infisical, which the sandbox blocks. Reading `.env.schema` still tells an agent everything about the shape of the config, which is the point.

### GitHub Secrets `PROD_SECRETS` / `DEV_SECRETS` (legacy)

These predate the Infisical integration and are no longer referenced by `docker-build.yml`. Do not delete them until the Infisical-based pipeline has run successfully at least once — keep as a rollback path in the meantime.

## Architecture

Personal blog frontend: **Astro 7 (SSR)** + **Vue 3 islands**, backed by a **WordPress GraphQL API**.

### Astro vs Vue

- **Astro (`.astro`)** — layouts, static markup, meta tags, page shells. Zero JS by default.
- **Vue (`.vue`)** — interactive islands: toggles, forms, modals, search, comments.

Do not add client-side state or interactivity to `.astro` components — create a Vue component instead.

### Directory Structure

| Directory          | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `src/pages/`       | File-based routing; `[lang]/` for i18n, `api/` for server endpoints |
| `src/components/`  | Mixed Vue + Astro components                                        |
| `src/layouts/`     | Page wrappers (`DefaultLayout`, `BlogPost`)                         |
| `src/features/`    | Feature modules with co-located components, types, and services     |
| `src/stores/`      | Nanostores atoms (`store.ts`) and i18n store (`i18n.ts`)            |
| `src/composables/` | Vue composables (e.g., `useI18n`)                                   |
| `src/services/`    | GraphQL queries/mutations + fetch utilities                         |
| `src/gql/`         | **Auto-generated — never edit manually**                            |
| `src/utils/i18n/`  | Translation helpers (`getLangFromUrl`, `useTranslations`)           |
| `src/styles/`      | Global SCSS (ITCSS: base, components, objects, utilities)           |
| `src/content/`     | Astro content collections — only locale JSON files                  |
| `src/tests/`       | Unit tests (`unit/`), E2E tests (`e2e/`), MSW mocks                 |

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
- **PWA is disabled** (commented out in `astro.config.mjs`) — do not re-enable; `@vite-pwa/astro`'s peer range tops out at Astro 5, still incompatible on Astro 7.
- **`pnpm build:strict` is the CI standard** — always type-check before considering a build complete.
- **`@codecov/astro-plugin`** is not compatible with `@vite-pwa/astro` — keep PWA disabled or migrate to direct Vite plugins.
