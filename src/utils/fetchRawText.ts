const REQUEST_TIMEOUT_MS = 15_000;

const cache = new Map<string, Promise<string>>();

/**
 * Fetch a raw text file (e.g. a GitHub raw URL embedded in a post) once per
 * process, so the same snippet used in several posts is downloaded once per build.
 * Times out instead of hanging the build; failed requests aren't cached.
 */
export const fetchRawText = (url: string): Promise<string> => {
  let pending = cache.get(url);

  if (!pending) {
    pending = fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }).then((response) =>
      response.text(),
    );
    pending.catch(() => cache.delete(url));
    cache.set(url, pending);
  }

  return pending;
};
