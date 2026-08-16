import { describe, expect, it, vi } from "vitest";

vi.mock("astro:env/server", () => ({
  IMAGOR_HOST: "https://assets.kasimir.dev/",
  IMAGOR_SECRET: "1234",
}));

const { signImagorPath } = await import("@utils/imagor");

describe("signImagorPath", () => {
  it("trims a trailing slash off IMAGOR_HOST so the signed URL has no double slash", () => {
    const signed = signImagorPath("fit-in/1x1/x");

    expect(signed.startsWith("https://assets.kasimir.dev/")).toBe(true);
    expect(signed).not.toContain("assets.kasimir.dev//");
  });
});
