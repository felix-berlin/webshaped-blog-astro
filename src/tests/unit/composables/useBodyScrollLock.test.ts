import { useBodyScrollLock } from "@composables/useBodyScrollLock";
import { describe, expect, it } from "vitest";
import { effectScope } from "vue";

const isLocked = () => document.body.classList.contains("u-disable-scroll");

describe("useBodyScrollLock", () => {
  it("keeps the page locked until every caller has released its lock", () => {
    const lockA = useBodyScrollLock();
    const lockB = useBodyScrollLock();

    lockA(true);
    lockB(true);
    lockA(false);
    expect(isLocked()).toBe(true);

    lockB(false);
    expect(isLocked()).toBe(false);
  });

  it("counts a repeated lock from the same caller once", () => {
    const lock = useBodyScrollLock();

    lock(true);
    lock(true);
    lock(false);
    expect(isLocked()).toBe(false);
  });

  it("releases a caller's lock when its scope is disposed", () => {
    const scope = effectScope();
    const lock = scope.run(() => useBodyScrollLock())!;

    lock(true);
    scope.stop();
    expect(isLocked()).toBe(false);
  });
});
