import type { Lang } from "@utils/i18n/ui";

import { useTranslations } from "@utils/i18n/utils";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export function useI18n(lang: MaybeRefOrGetter<Lang>) {
  const t = computed(() => useTranslations(toValue(lang)));

  return { t };
}
