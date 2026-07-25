## Why

Astro 7 is out and the integrations this project depends on (`@astrojs/vue`, `@astrojs/node`, `@sentry/astro`, `astro-matomo`) have already moved their latest published versions to require `astro ^7.0.0` as a peer. Staying on 6.3.1 means future dependency updates (Renovate bumps land in this repo constantly, per recent commit history) will increasingly fail peer resolution or silently pull in versions that no longer target the installed Astro major.

## What Changes

- Bump `astro` from `^6.3.1` to `^7` (currently resolves to 7.1.3).
- Bump `@astrojs/vue` from `^6.0.1` to `^7` and `@astrojs/node` from `^10.1.0` to the version whose peer declares `astro ^7.0.0`.
- Confirm `@sentry/astro`, `astro-matomo`, `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/check` resolve cleanly against Astro 7 (their current peer ranges already allow it or are unconstrained).
- **BREAKING (upstream, not user-facing on its own)**: Astro 7's Rust-based compiler is stricter about HTML validity — unclosed non-void tags that were previously auto-corrected now error at build time. Requires a clean `pnpm build:strict` pass; any `.astro` file with unclosed tags must be fixed.
- **BREAKING (upstream)**: `compressHTML` default changes from `true` to JSX-style whitespace stripping, which can collapse whitespace between adjacent inline elements (e.g. `<span>hello</span><em>world</em>` → "helloworld"). Decision needed: accept new default and visually verify, or pin `compressHTML: true` in `astro.config.mjs` to preserve current behavior.
- Decide the fate of `@codecov/astro-plugin` (`^2.0.1`): its latest version's peer dependency only declares support for `astro "4.x || 5.x"`, which is already mismatched today on Astro 6.3.1. The v7 bump doesn't create this problem but does make it more visible — needs a decision (verify it still functions, or drop it) rather than a silent carry-forward.
- No changes needed for: markdown/remark pipeline (no `.md`/`.mdx` files in `src`), `astro:db` (unused), `astro:transitions` internal APIs (unused), `getContainerRenderer` import path (unused), `src/fetch.ts` (no collision), experimental-flags-graduated-to-stable cleanup (only `clientPrerender` is set, which isn't one of the graduated flags).

## Capabilities

### New Capabilities

- `build-tooling`: The Astro/Vite build toolchain version and configuration requirements for the site (currently undocumented as a spec; this change establishes the baseline at Astro 7 / Vite 8).

### Modified Capabilities

_None — no existing specs cover this area yet._

## Impact

- `package.json`: version bumps for `astro`, `@astrojs/vue`, `@astrojs/node`, and re-verification of `@sentry/astro`, `astro-matomo`, `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/check`, `@codecov/astro-plugin`.
- `astro.config.mjs`: possible addition of `compressHTML: true` depending on the whitespace-regression decision; no other config keys require changes (no graduated experimental flags in use).
- All 18 `.astro` files: candidates for Rust-compiler HTML-validity errors; require a `pnpm build:strict` pass to surface and fix.
- `pnpm-lock.yaml`: full relock after bumps.
- CI (`.github/workflows/*.yml`): no version-pin changes expected (`node-version: "lts/*"` already satisfies Astro 7's Node requirement).
