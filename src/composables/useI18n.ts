import { useTranslations } from "@utils/i18n/utils";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export function useI18n(lang: MaybeRefOrGetter<"de" | "en">) {
  const t = computed(() => useTranslations(toValue(lang)));

  return { t };
}
