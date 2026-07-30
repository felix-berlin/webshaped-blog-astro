## 1. Dependency bump

- [x] 1.1 Bump `astro` to `^7` in `package.json`
- [x] 1.2 Bump `@astrojs/vue` to `^7` in `package.json`
- [x] 1.3 Bump `@astrojs/node` to the version whose peer declares `astro ^7.0.0`
- [x] 1.4 Run `pnpm install`; resolve any peer-dependency errors (expect friction from `@codecov/astro-plugin`)

## 2. Codecov plugin decision

- [x] 2.1 Check whether Codecov bundle-analysis output is actually consumed anywhere (dashboards, PR checks) to inform keep-vs-drop
- [x] 2.2 Run a production build with `@codecov/astro-plugin` enabled; confirm it completes and bundle stats upload
- [x] 2.3 If verification fails or the integration isn't load-bearing, remove `@codecov/astro-plugin` from `astro.config.mjs` and `package.json`

## 3. Build verification

- [x] 3.1 Run `pnpm build:strict`; fix any Rust-compiler HTML-validity errors (unclosed non-void tags) file by file across the 18 `.astro` files
- [x] 3.2 Run `pnpm build`; confirm production build output is generated without errors

## 4. Whitespace / compressHTML regression check

- [x] 4.1 Start `pnpm dev` and visually review pages with adjacent inline elements (blog post body, comment threads, nav) for lost whitespace
- [x] 4.2 If a regression is found, add `compressHTML: true` to `astro.config.mjs`; otherwise accept the new default

## 5. Test suite

- [x] 5.1 Run `pnpm test:unit`; fix any failures caused by the upgrade
- [x] 5.2 Run `pnpm test:e2e`; fix any failures caused by the upgrade
- [x] 5.3 Run `pnpm typechecking` to confirm no residual type errors from `@astrojs/check` version changes

## 6. Wrap-up

- [x] 6.1 Review full diff of `pnpm-lock.yaml` for unexpected unrelated version churn
- [x] 6.2 Update `CLAUDE.md` if any documented commands, versions, or pitfalls changed as a result of the upgrade
