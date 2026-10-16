import { getCurrentScope, onScopeDispose } from "vue";

let activeLocks = 0;

/**
 * Body scroll lock shared by every caller (modal, mobile flyout): the page only
 * scrolls again once all of them have released their lock. Returns a setter for
 * this caller's lock, which is released automatically when its component unmounts.
 */
export function useBodyScrollLock() {
  let locked = false;

  const setLocked = (lock: boolean): void => {
    if (lock === locked) return;
    locked = lock;
    activeLocks += lock ? 1 : -1;
    document.body.classList.toggle("u-disable-scroll", activeLocks > 0);
  };

  if (getCurrentScope()) onScopeDispose(() => setLocked(false));

  return setLocked;
}
