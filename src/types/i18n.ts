import type { Lang } from "@utils/i18n/ui";

/** Absolute, root-relative paths keyed by locale (e.g. `{ de: "/de", en: "/en" }`). */
export type TranslationRoutes = Partial<Record<Lang, string>>;
