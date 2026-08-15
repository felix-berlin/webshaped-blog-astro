# i18n language switcher and locale routing

## Application Overview

E2E coverage for the site's language switcher and locale routing added as part of the i18n overhaul. The blog is served under /de (default) and /en, with a redirect from / to /de and a 404 for unconfigured locales like /fr. The header includes a language-switcher dropdown (icon button that reveals "Deutsch"/"English" links) that must correctly link to the equivalent page in the other language, both on the homepage and on individual blog post pages, updating both the URL and the page's html lang attribute.

## Test Scenarios

### 1. i18n language switcher and locale routing

**Seed:** `tests/e2e/seed.spec.ts`

#### 1.1. redirects / to /de

**File:** `tests/e2e/i18n-language-switcher.spec.ts`

**Steps:**

1. Navigate to the site root ("/") - expect: The browser ends up at "/de" (redirected) - expect: The page renders German homepage content

#### 1.2. switches language from the homepage via the header dropdown

**File:** `tests/e2e/i18n-language-switcher.spec.ts`

**Steps:**

1. Navigate to "/de" - expect: The page is the German homepage
2. Click the language-switcher icon button in the header - expect: A dropdown appears with links labeled "Deutsch" and "English"
3. Click the "English" link - expect: The URL becomes "/en" - expect: The page shows visibly different (English) homepage content, e.g. an English heading, distinct from the German homepage text

#### 1.3. switches language from a blog post page via the header dropdown

**File:** `tests/e2e/i18n-language-switcher.spec.ts`

**Steps:**

1. Navigate to a German blog post, e.g. "/de/posts/matomo-tracking-script-optimal-einbinden" - expect: The page renders the German post - expect: The <html> element's lang attribute is "de"
2. Click the language-switcher icon button in the header, then click the "English" link in the dropdown - expect: The URL changes to the post's English translation URL under "/en/posts/..." - expect: The <html> element's lang attribute becomes "en" - expect: The page shows the English translation of the post (different title/content than the German version)

#### 1.4. returns 404 for an unconfigured locale

**File:** `tests/e2e/i18n-language-switcher.spec.ts`

**Steps:**

1. Navigate to "/fr/" - expect: The response status is 404 - expect: The page shows a not-found page, not German (or any locale) content
