## ADDED Requirements

### Requirement: Astro major version alignment

The project's `astro` package and all first-party Astro integrations (`@astrojs/vue`, `@astrojs/node`, `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/check`) SHALL declare and resolve to versions whose peer dependency ranges are mutually compatible, with `astro` at major version 7.

#### Scenario: Clean install with no peer conflicts

- **WHEN** `pnpm install` runs against the upgraded `package.json`
- **THEN** it completes without unresolved peer-dependency errors for `astro` or its first-party integrations

#### Scenario: Third-party integrations declare Astro 7 support

- **WHEN** `@sentry/astro` and `astro-matomo` are resolved during install
- **THEN** the installed versions' `peerDependencies.astro` range includes `^7.0.0`

### Requirement: Production build succeeds under the Rust compiler

The site SHALL build successfully (`pnpm build:strict`) under Astro 7's default Rust-based compiler, with all `.astro` files containing valid, fully-closed HTML markup.

#### Scenario: Strict build passes

- **WHEN** `pnpm build:strict` is run against the upgraded dependencies
- **THEN** the build completes with no HTML-validity errors from the compiler and no new TypeScript errors from `astro check`/`tsc`/`vue-tsc`

### Requirement: Bundle-analysis integration compatibility is verified

The `@codecov/astro-plugin` integration SHALL either be confirmed functional against Astro 7 (bundle stats continue to upload on build) or be removed from `astro.config.mjs` if it cannot be verified or is not load-bearing.

#### Scenario: Codecov plugin verified working

- **WHEN** a production build runs with `@codecov/astro-plugin` enabled post-upgrade
- **THEN** bundle-size stats are uploaded to Codecov without error, despite the plugin's declared peer range not listing Astro 7

#### Scenario: Codecov plugin removed if non-functional

- **WHEN** the plugin fails to produce a working build or bundle upload under Astro 7
- **THEN** it is removed from `astro.config.mjs` and `package.json` rather than left in a silently-broken state

### Requirement: No unintended whitespace regressions from HTML compression default change

Rendered pages SHALL preserve visible whitespace between adjacent inline elements (e.g. in blog post content, comment threads, and navigation) despite Astro 7's `compressHTML` default changing to JSX-style stripping.

#### Scenario: Adjacent inline elements retain expected spacing

- **WHEN** a page containing adjacent inline elements (e.g. `<span>`/`<em>`/`<a>` siblings) is rendered after the upgrade
- **THEN** visible whitespace between them matches pre-upgrade rendering, either because the new default doesn't affect that markup or because `compressHTML: true` was set to preserve prior behavior
