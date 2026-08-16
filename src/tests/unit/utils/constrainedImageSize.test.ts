import { describe, expect, it, vi } from "vitest";

const captureExceptionMock = vi.fn();
vi.mock("@sentry/astro", () => ({ captureException: captureExceptionMock }));

const { computeConstrainedSize } = await import("@utils/constrainedImageSize");

describe("computeConstrainedSize", () => {
  it("derives height from the real aspect ratio when WP dimensions are present", () => {
    expect(computeConstrainedSize(800, 1000, 1500, "test")).toEqual({ height: 1200, width: 800 });
  });

  it.each([
    [null, 1500],
    [1000, null],
    [undefined, undefined],
    [0, 1500],
    [1000, 0],
  ])(
    "falls back to a fixed 400px height and reports it when dimensions are missing (%o, %o)",
    (rawWidth, rawHeight) => {
      captureExceptionMock.mockClear();

      const result = computeConstrainedSize(800, rawWidth, rawHeight, "test-context");

      expect(result).toEqual({ height: 400, width: 800 });
      expect(captureExceptionMock).toHaveBeenCalledOnce();
      expect(captureExceptionMock.mock.calls[0][0].message).toContain("test-context");
    },
  );
});
