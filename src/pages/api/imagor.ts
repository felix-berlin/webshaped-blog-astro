import type { APIRoute } from "astro";

import { buildImagorPath, signImagorPath } from "@utils/imagor";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

// This endpoint is a public signing oracle: anyone can ask it to sign a
// fetch of an arbitrary `src` (imagor does the actual fetch). Block
// non-https and private/loopback/link-local targets so it can't be used to
// probe or hit internal network services (SSRF). No per-domain allowlist —
// by decision, since the current callers (WP avatars, last.fm covers) are
// operator-controlled hosts. This can't fully rule out DNS rebinding on a
// hostname it doesn't recognize; genuinely untrusted, attacker-supplied
// URLs (e.g. webmention author photos) must not be routed through here —
// render those with their original, unproxied src instead.
const MAX_DIMENSION = 2000;
// `format` is interpolated into imagor's filter pipeline string
// (`filters:format(x)`) — allowlist it so an unauthenticated caller can't
// inject extra filters.
const ALLOWED_FORMATS = new Set(["avif", "jpeg", "png", "webp"]);

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return true;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    a >= 224 // multicast (224-239) + reserved (240-255)
  );
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === "::1" || normalized === "::") return true;
  if (
    normalized.startsWith("fe80:") ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("ff") // multicast
  ) {
    return true;
  }
  const mapped =
    /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(normalized) ?? /^::(\d+\.\d+\.\d+\.\d+)$/.exec(normalized);
  return mapped ? isPrivateIPv4(mapped[1]) : false;
}

async function resolvesToPrivateAddress(hostname: string): Promise<boolean> {
  const literalKind = isIP(hostname);
  if (literalKind === 4) return isPrivateIPv4(hostname);
  if (literalKind === 6) return isPrivateIPv6(hostname);

  try {
    // Check every resolved address, not just the first — a multi-A-record
    // host could put a public IP first and a private one second.
    const results = await lookup(hostname, { all: true });
    return results.some(({ address, family }) =>
      family === 4 ? isPrivateIPv4(address) : isPrivateIPv6(address),
    );
  } catch {
    // Unresolvable — block rather than let imagor try and fail differently.
    return true;
  }
}

export const GET: APIRoute = async ({ url }) => {
  const src = url.searchParams.get("src");
  const width = Number(url.searchParams.get("w"));
  const height = Number(url.searchParams.get("h"));
  const format = url.searchParams.get("format") ?? undefined;

  if (
    !src ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0 ||
    (format && !ALLOWED_FORMATS.has(format))
  ) {
    return new Response("Invalid imagor parameters", { status: 400 });
  }

  let upstream: URL;
  try {
    upstream = new URL(src);
  } catch {
    return new Response("Invalid imagor parameters", { status: 400 });
  }

  if (upstream.protocol !== "https:" || (await resolvesToPrivateAddress(upstream.hostname))) {
    return new Response("Invalid imagor parameters", { status: 400 });
  }

  const path = buildImagorPath(src, {
    format,
    height: Math.min(height, MAX_DIMENSION),
    width: Math.min(width, MAX_DIMENSION),
  });

  return Response.redirect(signImagorPath(path), 302);
};
