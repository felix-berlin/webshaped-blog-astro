import { describe, expect, it } from "vitest";
import { ref } from "vue";

import { useI18n } from "@/composables/useI18n";

describe("useI18n", () => {
  it("translates using the language passed in, not a stored value", () => {
    const { t } = useI18n(() => "en");
    expect(t.value("search")).not.toBe("search");
  });

  it("re-resolves translations when the source lang changes", () => {
    // Uses a `ref` (not a plain closure variable) so the change is actually
    // observable by Vue's reactivity system: `computed()` only re-evaluates
    // when its getter reads a tracked reactive source. A plain `let` mutated
    // after the fact would never invalidate the computed's cache, since
    // `computed` has no way to observe writes to an untracked variable.
    const lang = ref<"de" | "en">("de");
    const { t } = useI18n(lang);
    const deResult = t.value("search");
    lang.value = "en";
    const enResult = t.value("search");
    expect(deResult).not.toBe(enResult);
  });
});
