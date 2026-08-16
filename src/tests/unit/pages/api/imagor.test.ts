import { beforeEach, describe, expect, it, vi } from "vitest";

const buildImagorPathMock = vi.fn(() => "fit-in/100x100/filters:format(webp):quality(80)/enc");
const signImagorPathMock = vi.fn((path: string) => `https://assets.kasimir.dev/signed/${path}`);
const captureExceptionMock = vi.fn();

vi.mock("@utils/imagor", () => ({
  buildImagorPath: buildImagorPathMock,
  signImagorPath: signImagorPathMock,
}));
vi.mock("@sentry/astro", () => ({ captureException: captureExceptionMock }));

const { GET } = await import("@/pages/api/imagor");

function request(params: Record<string, string>): { url: URL } {
  const url = new URL("https://webshaped.test/api/imagor");
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return { url };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/imagor", () => {
  it("redirects to a signed URL for a valid https request at an allowed width", async () => {
    const response = await GET(
      request({ h: "100", src: "https://cms.webshaped.test/foo.png", w: "800" }) as never,
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "https://assets.kasimir.dev/signed/fit-in/100x100/filters:format(webp):quality(80)/enc",
    );
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=86400");
    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it("allows a tall (portrait) height at the widest responsive breakpoint", async () => {
    // 1600w at a 2:3 portrait ratio derives h=2400 — this used to be rejected
    // by a flat MAX_DIMENSION=2000 on both axes, breaking real portrait photos.
    const response = await GET(
      request({ h: "2400", src: "https://cms.webshaped.test/foo.png", w: "1600" }) as never,
    );
    expect(response.status).toBe(302);
  });

  it("redirects for any https host — imagor's own HTTP_LOADER_ALLOWED_SOURCES is the host allowlist, not this endpoint", async () => {
    const response = await GET(
      request({ h: "100", src: "https://upload.wikimedia.org/foo.png", w: "800" }) as never,
    );
    expect(response.status).toBe(302);
  });

  it("rejects a missing src", async () => {
    const response = await GET(request({ h: "100", w: "800" }) as never);
    expect(response.status).toBe(400);
    expect(captureExceptionMock).toHaveBeenCalledOnce();
  });

  it.each([
    { h: "100", w: "100" }, // not one of RESPONSIVE_WIDTHS or the 800 base width
    { h: "100", w: "0" },
    { h: "100", w: "-5" },
    { h: "100", w: "1.5" },
  ])("rejects a disallowed width %o", async (dims) => {
    const response = await GET(
      request({ src: "https://cms.webshaped.test/foo.png", ...dims }) as never,
    );
    expect(response.status).toBe(400);
  });

  it.each([
    { h: "0", w: "800" },
    { h: "-5", w: "800" },
    { h: "1.5", w: "800" },
    { h: "abc", w: "800" },
  ])("rejects an invalid height %o", async (dims) => {
    const response = await GET(
      request({ src: "https://cms.webshaped.test/foo.png", ...dims }) as never,
    );
    expect(response.status).toBe(400);
  });

  it("rejects a height above imagor's own VIPS_MAX_HEIGHT instead of silently clamping", async () => {
    const response = await GET(
      request({ h: "5001", src: "https://cms.webshaped.test/foo.png", w: "800" }) as never,
    );
    expect(response.status).toBe(400);
    expect(buildImagorPathMock).not.toHaveBeenCalled();
  });

  it("rejects a disallowed format without letting it reach buildImagorPath", async () => {
    const response = await GET(
      request({
        format: "gif",
        h: "100",
        src: "https://cms.webshaped.test/foo.png",
        w: "800",
      }) as never,
    );
    expect(response.status).toBe(400);
    expect(buildImagorPathMock).not.toHaveBeenCalled();
  });

  it("treats an empty format param as absent rather than passing '' through", async () => {
    const response = await GET(
      request({
        format: "",
        h: "100",
        src: "https://cms.webshaped.test/foo.png",
        w: "800",
      }) as never,
    );
    expect(response.status).toBe(302);
    expect(buildImagorPathMock).toHaveBeenCalledWith("https://cms.webshaped.test/foo.png", {
      format: undefined,
      height: 100,
      width: 800,
    });
  });

  it("rejects a non-https src", async () => {
    const response = await GET(
      request({ h: "100", src: "http://cms.webshaped.test/foo.png", w: "800" }) as never,
    );
    expect(response.status).toBe(400);
  });

  it("rejects an unparseable src", async () => {
    const response = await GET(request({ h: "100", src: "not a url", w: "800" }) as never);
    expect(response.status).toBe(400);
  });
});
