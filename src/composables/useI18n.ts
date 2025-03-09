import { useTranslations } from "@utils/i18n/utils";
import { useStore } from "@nanostores/vue";
import { currentLanguage } from "@stores/store";
import { computed } from "vue";

export function useI18n() {
  const lang = useStore(currentLanguage);

  const t = computed(() => useTranslations(lang.value));

  return { t };
}
