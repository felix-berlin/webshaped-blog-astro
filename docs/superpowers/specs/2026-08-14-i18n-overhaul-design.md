# i18n Overhaul — Design

## Problem

The site's i18n implementation is not one system with a few bugs — it is
**three parallel, disconnected mechanisms** that each partially handle
language, none of them fully:

1. **URL-based (Astro pages)** — `getLangFromUrl()` reads `/de/...` /
   `/en/...` from the path. Only works for routes actually living under
   `src/pages/[lang]/...` (about, category, posts, rss).
2. **`currentLanguage` nanostore** (`src/stores/store.ts`) — read by every
   Vue island via `useI18n()` (Comments, Share, Modal, RssLink, Tabs,
   Webmentions). Hardcoded initial value `"de"`. The only code that ever
   calls `.set()` on it, `StoreSetter.vue`, is imported into
   `BaseHead.astro` but never rendered in its template — a dead import.
   Result: every Vue-side translation is permanently stuck on German.
3. **`src/stores/i18n.ts`** (`@nanostores/i18n`) — entirely orphaned. Fetches
   `/locales/{code}.json`, a path that doesn't exist anywhere in the
   project. No real caller.

On top of the split state, routing itself is inconsistent:

- **`src/pages/index.astro`** (the homepage, `/`) has no `[lang]` prefix.
  `getLangFromUrl(Astro.url)` on `/` always resolves to `defaultLang`
  ("de"), and the WordPress slug fetched is hardcoded to `"startseite"`.
  There is no route for `/en` — the homepage cannot change language at
  all. This is the reported symptom ("auf der Startseite funktioniert es
  gar nicht").
- **`src/pages/[pageSlug].astro`** (Datenschutz/Impressum) has no language
  handling whatsoever.
- The **language switcher UI is commented out**
  (`MainHeader.astro`: `<!-- <LanguageSelect .../> -->`). The component it
  references, `LanguageSelect.vue`, doesn't exist — the real component is
  `LanguageDropdown.vue`, which is never rendered anywhere. Users
  currently have no way to switch language via the UI at all.
- Astro's built-in i18n routing (`i18n: {...}` in `astro.config.mjs`) is
  not used; everything is hand-rolled via `[lang]` dynamic-segment
  folders, applied inconsistently.

## Goals

- Every page (including the homepage and legal pages) resolves language
  from a real, prefixed URL (`/de/...`, `/en/...`); `/` redirects to the
  default locale.
- A single source of truth for "what language is this request in" — no
  parallel stores that can disagree.
- A working, user-facing language switcher.
- Adopt Astro's native i18n primitives (`astro:i18n`) for routing/URL
  concerns, keeping the project's existing string-translation approach
  (`useTranslations`/`localeStrings`) since Astro has no built-in
  string-translation mechanism.

## Non-goals

- Rewriting the string-translation format (`localeStrings`,
  `de-DE.json`/`en-US.json`) — that part already works and isn't part of
  the reported problem.
- Adding more languages beyond `de`/`en`.
- Migrating to Astro's automatic locale-folder routing (see "Rejected
  approach" below).

## Approach: `astro:i18n` with `routing: "manual"`

```js
// astro.config.mjs
i18n: {
  locales: ["de", "en"],
  defaultLocale: "de",
  routing: "manual",
}
```

`"manual"` disables Astro's automatic locale-folder middleware but still
provides the official helpers (`getRelativeLocaleUrl`, `pathHasLocale`,
`redirectToDefaultLocale`, `notFound`). The project keeps its existing
`[lang]` dynamic-segment file layout — appropriate because pages are
generated from WordPress GraphQL slugs via `getStaticPaths`/SSR, not from
static per-locale files.

### Rejected approach: automatic locale-folder routing

Astro's default i18n routing expects literal per-locale folders
(`src/pages/de/...`, `src/pages/en/...`). For this project's
WP-GraphQL-driven dynamic routes (`[...about]`, `[slug]/[page]`,
`[postSlug]`), that would mean either duplicating every dynamic route
file per locale, or building an indirection layer on top — which ends up
looking like the manual approach anyway, without the automatic-routing
benefit actually applying to the routes that need it most. Rejected:
higher structural churn, higher regression risk, no proportionate payoff
for this content model.

## Design

### Routing layer

| File | Change |
|---|---|
| `astro.config.mjs` | Add `i18n` config as above. |
| `src/middleware.ts` **(new)** | Central locale handling: `pathHasLocale` detects `/de/...` \| `/en/...`. Bare `/` → `redirectToDefaultLocale` (302). Unknown locale segment → `notFound()`. |
| `src/pages/index.astro` | Becomes a thin redirect stub (`/` → `/de`) — no more hardcoded `"startseite"` fetch happening at the bare root. |
| `src/pages/[lang]/index.astro` **(new)** | The actual homepage, consistent with `[lang]/[...about].astro`: reads the `"startseite"` WP page via its `translation` field per the resolved language, the way `[...about].astro` already does for `"ueber-mich"`. |
| `src/pages/[pageSlug].astro` → `src/pages/[lang]/[pageSlug].astro` | Datenschutz/Impressum get the same translation-aware treatment as `[...about].astro`, including the `Astro.rewrite("/404")` fallback when a slug has no translation in the requested language. |
| `src/utils/i18n/utils.ts` | `getLangFromUrl`/`createLocalizedUrl` replaced by `astro:i18n` helpers (`getRelativeLocaleUrl`, `getLocaleByPath`) where a direct equivalent exists. `useTranslations`/`pluralFormFor` (string lookup, not a routing concern) are unchanged. |

### State layer

- **Delete `src/stores/i18n.ts`** — dead `@nanostores/i18n` setup, no
  real callers, references a non-existent `/locales/*.json` path.
- **Language reaches Vue islands via props, not a store.** Each Astro
  page/layout already knows `lang` from the resolved route. Pass it as a
  prop down to the Vue islands that call `useI18n()`: `CommentItem.vue`,
  `Share.vue`, `Modal.vue`, `RssLink.vue`, `tabs/TabDisplay.vue`,
  `webmentions/WebmentionsItem.vue`. `useI18n()`'s signature changes from
  reading a nanostore to accepting `lang` directly (or its callers pass
  `useTranslations(lang)` directly and `useI18n()` is removed — decide at
  implementation time based on how many call sites benefit from the
  composable wrapper).
- **Remove `currentLanguage` and `StoreSetter.vue`.** They existed only to
  bridge Astro's server-known `lang` into the Vue-island tree; prop
  passing replaces that bridge directly, removing the dead-import bug
  class entirely rather than patching it.
- **Re-enable the language switcher**: render `<LanguageDropdown />` in
  `MainHeader.astro` (the commented-out reference to `LanguageSelect.vue`
  is stale — that file doesn't exist), wired to the already-computed
  `translationsRoutes`. `LanguageDropdown.vue` itself currently reads
  `currentLanguage`/`translationRoutes` from the nanostore — update it to
  take `lang`/`routes` as props instead, consistent with the prop-passing
  decision above.

### Error handling & fallback

- Unknown locale segment in the URL (e.g. `/fr/...`) → `notFound()` via
  middleware — a real 404 instead of the current silent fallback to
  `defaultLang`.
- WP page/post without a translation in the requested language: unchanged
  behavior — `translationsRoutes` only contains languages that actually
  have a translation, so the switcher never links to a non-existent page.
- `/` → `/de` redirect is a 302, keeping the door open for a future
  Accept-Language-based default without baking a permanent redirect into
  caches/SEO.
- `[lang]/[pageSlug].astro` reuses the existing
  `Astro.rewrite("/404")` pattern from `[...about].astro` when a slug
  isn't found in the requested language.

### Testing

- Unit tests (`src/tests/unit/`) for the `astro:i18n`-based URL helpers in
  `src/utils/i18n/utils.ts` and for `src/middleware.ts`: `/` redirects,
  unknown locale 404s, known locales pass through.
- Component tests updated for the prop-based `useI18n`/`LanguageDropdown`
  signature changes.
- E2E (Playwright, `tests/e2e/`): click the language switcher on the
  homepage and on a subpage, verify both URL and content change — not
  testable before, since the switcher didn't render at all. Built with the
  Playwright MCP agents rather than hand-written: `playwright-test-planner`
  drafts the scenario list (switcher on homepage, switcher on a subpage,
  `/` redirect, unknown-locale 404) against the running dev server,
  `playwright-test-generator` turns each approved plan item into a spec
  file under `tests/e2e/`, and `playwright-test-healer` is the go-to when
  a generated or existing i18n test starts failing during implementation,
  instead of debugging Playwright failures by hand.
- No new test framework needed; everything fits the existing
  Vitest/Playwright setup.

## Open items for the implementation plan

- Whether `useI18n()` survives as a thin prop-based composable or is
  removed in favor of calling `useTranslations(lang)` directly at each
  call site — pick based on how many of the six call sites want the
  composable ergonomics.
- Exact redirect status code and whether the `/` stub should preserve
  query params/pathname suffixes (there shouldn't be any today, since `/`
  only ever matched the bare root, but worth confirming during
  implementation).
