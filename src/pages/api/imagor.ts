import type { APIRoute } from "astro";

import { buildImagorPath, signImagorPath } from "@utils/imagor";
import { RESPONSIVE_WIDTHS } from "@utils/imagorClient";
import { captureException } from "@sentry/astro";

// This endpoint is a signing oracle: anyone can ask it to sign a fetch of a
// `src` (imagor does the actual fetch). SSRF and host restriction are
// enforced by imagor's own HTTP loader config (HTTP_LOADER_ALLOWED_SOURCES,
// HTTP_LOADER_BLOCK_PRIVATE_NETWORKS / _LOOPBACK_NETWORKS /
// _LINK_LOCAL_NETWORKS, HTTP_LOADER_HTTPS_ONLY) — that's the right place for
// it: it runs immediately before the actual fetch, not at sign time, so it
// isn't subject to the DNS-rebinding TOCTOU gap a check here would have.
// Duplicating an allowlist here would also drift from imagor's own (it also
// allows upload.wikimedia.org and m.media-amazon.com for embedded post
// images, not just our own WP media host).
//
// What's validated here instead is specific to *this* endpoint: `format` is
// interpolated into imagor's filter pipeline string that we build ourselves
// (`filters:format(x)`), so an unauthenticated caller must not be able to
// inject extra filters through it. `width` is restricted to the exact
// breakpoints FigureBlock.vue actually requests (imagorClient.ts's
// RESPONSIVE_WIDTHS, plus its fixed 800px <img> base width) rather than any
// positive integer — this is what actually bounds this endpoint from being
// used to mint an unbounded number of distinct signed (w, h, format) cache
// entries against the imagor host, which a request-count SSRF/allowlist
// check would not have prevented anyway. `height` is derived by the caller
// from the real image's aspect ratio, so it isn't restricted to a fixed set
// — it's bounded by imagor's own VIPS_MAX_HEIGHT (5000) instead, since
// there's no reason for us to be stricter than what imagor already enforces.
//
// Genuinely untrusted, attacker-supplied URLs (e.g. webmention author
// photos) must never be routed through here regardless — render those with
// their original, unproxied src instead.
const ALLOWED_WIDTHS = new Set([...RESPONSIVE_WIDTHS, 800]);
const MAX_HEIGHT = 5000;
const ALLOWED_FORMATS = new Set(["avif", "jpeg", "png", "webp"]);

function reject(reason: string, detail: string): Response {
  const message = `/api/imagor rejected (${reason}): ${detail}`;
  console.warn(message);
  // A rejection here means either a hostile probe or (for the one first-party
  // caller, FigureBlock.vue) our own code/data producing an out-of-contract
  // request — worth an alert either way, not just container logs.
  captureException(new Error(message));
  return new Response("Invalid imagor parameters", { status: 400 });
}

export const GET: APIRoute = async ({ url }) => {
  const src = url.searchParams.get("src");
  const width = Number(url.searchParams.get("w"));
  const height = Number(url.searchParams.get("h"));
  const format = url.searchParams.get("format") || undefined;

  if (!src) return reject("missing src", "no src parameter");
  if (!ALLOWED_WIDTHS.has(width)) {
    return reject("disallowed width", `w=${url.searchParams.get("w")}`);
  }
  if (!Number.isInteger(height) || height <= 0 || height > MAX_HEIGHT) {
    return reject("invalid height", `h=${url.searchParams.get("h")}`);
  }
  if (format && !ALLOWED_FORMATS.has(format)) {
    return reject("disallowed format", format);
  }

  let upstream: URL;
  try {
    upstream = new URL(src);
  } catch {
    return reject("unparseable src", src);
  }

  if (upstream.protocol !== "https:") {
    return reject("non-https src", src);
  }

  const path = buildImagorPath(src, { format, height, width });

  return new Response(null, {
    headers: {
      // Short-lived, not `immutable`: the signature depends on IMAGOR_SECRET,
      // so rotating it (or changing IMAGOR_HOST) must not leave clients
      // following a stale cached redirect for longer than this.
      "Cache-Control": "public, max-age=86400",
      Location: signImagorPath(path),
    },
    status: 302,
  });
};
