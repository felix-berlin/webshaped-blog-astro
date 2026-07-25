## Context

The project is on Astro 6.3.1, Vite 8.1.5 already, with `@astrojs/vue`, `@astrojs/node`, `@sentry/astro`, `astro-matomo`, `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/check`, and a custom in-repo Pagefind integration (`src/integrations/pagefind.ts`, standard `astro:build:done`/`astro:config:setup` hooks only). No content collections, no markdown files, no experimental flags that graduated to stable in v7. Renovate manages routine dep bumps here (recent commit history is almost entirely `chore(deps)` PRs), so falling behind a major on `astro` risks future peer-resolution breakage on unrelated Renovate PRs.

## Goals / Non-Goals

**Goals:**

- Get `astro` and its first-party integrations onto versions that mutually declare Astro 7 support.
- Pass `pnpm build:strict` (astro check + tsc + vue-tsc) cleanly under the new Rust compiler's stricter HTML validation.
- Make an explicit, documented decision on `@codecov/astro-plugin`'s stale peer range and on the `compressHTML` whitespace-behavior change, rather than discovering either in production.

**Non-Goals:**

- Re-enabling PWA (`@vite-pwa/astro`) — stays disabled per existing CLAUDE.md guidance, unrelated to this upgrade.
- Adopting any newly-stable v7 features beyond what's needed to unblock the version bump (e.g. no adoption of `logger`/`routeRules`/`cache` top-level config since nothing here used their experimental predecessors).
- Migrating markdown/content pipeline — not applicable, no markdown content exists.

## Decisions

**1. Bump `astro` and integrations together, not incrementally.**
Astro majors and their first-party integration majors are meant to move in lockstep (that's why `@astrojs/vue`'s latest peer is `^7.0.0`). Bumping `astro` alone and leaving `@astrojs/vue@^6` would just trade one peer mismatch for another. Alternative considered: bump `astro` first and see what breaks — rejected, since pnpm would immediately flag the peer mismatch anyway and there's no benefit to doing it in two commits.

**2. Treat `@codecov/astro-plugin` as a standalone decision, resolved before the bump lands.**
Its latest version (`2.0.1`) declares `peerDependencies.astro: "4.x || 5.x"` — already wrong for the current 6.3.1 install, so this isn't new risk introduced by v7, but the gap gets more visible (6→7 is a bigger jump than the plugin's declared range implies it's tested against). Two options:

- **(a) Verify and keep**: The plugin's job is bundling stats upload for Codecov's bundle-analysis product — it hooks into the Vite/Rollup build output, not Astro's rendering pipeline, so it plausibly doesn't care about the Astro major at all. Run a build with it enabled, confirm bundle stats still upload, and carry on with a pinned override if pnpm complains about the peer.
- **(b) Drop it**: If bundle-size tracking isn't load-bearing (no gate in CI depends on it, per `CLAUDE.md`'s "coding standard" listing — it's absent there), remove it rather than carry an unmaintained peer range forward.
  Recommendation: (a) first — try it, and only fall back to (b) if the build genuinely breaks. Low cost either way given it's one integration entry in `astro.config.mjs`.

**3. Verify `compressHTML` visually rather than pre-emptively pinning `true`.**
The new default (`'jsx'`-style stripping) is what Astro considers correct going forward, and pinning `true` re-introduces exactly the kind of "diverge from upstream default forever" cruft this project seems to actively avoid (see how aggressively PWA config is fenced off with a comment rather than silently left half-working). Default to accepting the new behavior; only add `compressHTML: true` if the `pnpm build:strict` + local visual pass on pages with adjacent inline elements (post cards, nav, comment threads — anywhere `<span>`/`<em>`/`<a>` sit next to each other) actually shows a regression.

**4. Rust-compiler HTML strictness is a build-and-fix pass, not a pre-scan.**
With 18 `.astro` files, grepping for "might be an unclosed tag" ahead of time is lower-signal than just running `pnpm build:strict` and reading the Rust compiler's errors, which point at exact file/line. Treat this as a task-list item executed during implementation, not a design question.

## Risks / Trade-offs

- [Codecov plugin stops working silently under Astro 7] → Build succeeds either way since it's a Vite/Rollup-level plugin; verify by checking Codecov's dashboard receives the next upload after the bump, not just by a clean local build.
- [Rust compiler rejects markup the Go compiler silently repaired] → `pnpm build:strict` surfaces this at build time with file/line; fix forward, no runtime risk since it fails closed (build breaks, doesn't ship broken HTML).
- [Whitespace collapse between inline elements ships unnoticed] → No automated visual-regression tooling in this repo (Playwright e2e exists but isn't a pixel-diff suite) — mitigate with a manual pass over pages known to have adjacent inline elements (blog post body content, comment threads, nav) before merging.
- [pnpm peer-dependency strictness blocks install] → If `pnpm install` refuses due to `@codecov/astro-plugin`'s stale range, resolve via decision #2 (verify-then-override, or drop) rather than reaching for `--no-strict-peer-dependencies` project-wide.

## Migration Plan

1. Bump `astro`, `@astrojs/vue`, `@astrojs/node` in `package.json`; `pnpm install`.
2. Resolve any peer-dependency friction from `@codecov/astro-plugin` per decision #2.
3. Run `pnpm build:strict`; fix any Rust-compiler HTML-validity errors file by file.
4. Manually review pages with adjacent inline elements for whitespace regressions from the `compressHTML` default change; add `compressHTML: true` to `astro.config.mjs` only if a real regression is found.
5. Run full test suite (`pnpm test:unit`, `pnpm test:e2e`) and `pnpm build` to confirm production build output.
6. Deploy to a preview/staging environment if available before merging to `main`, given this is a build-tooling change with no automated rollback beyond `git revert`.

No feature flag or gradual rollout applies — this is a build-time dependency upgrade; rollback is reverting the `package.json`/lockfile commit.

## Open Questions

- Does the team have a staging deploy step before `main`, or does this go straight to production on merge? (Affects how cautious step 6 needs to be.)
- Is Codecov bundle-analysis actually consumed by anyone, or is it vestigial? Answering this resolves decision #2 outright instead of needing the verify-then-decide fallback.
