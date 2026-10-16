import { fetchRawText } from "@utils/fetchRawText";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../mocks/node.ts";

describe("fetchRawText()", () => {
  it("fetches a URL only once and reuses the pending result", async () => {
    let calls = 0;
    server.use(
      http.get("https://raw.example.test/once.ts", () => {
        calls++;
        return HttpResponse.text("const a = 1;");
      }),
    );

    const [first, second] = await Promise.all([
      fetchRawText("https://raw.example.test/once.ts"),
      fetchRawText("https://raw.example.test/once.ts"),
    ]);
    const third = await fetchRawText("https://raw.example.test/once.ts");

    expect(first).toBe("const a = 1;");
    expect(second).toBe(first);
    expect(third).toBe(first);
    expect(calls).toBe(1);
  });

  it("does not cache a failed request", async () => {
    let calls = 0;
    server.use(
      http.get("https://raw.example.test/flaky.ts", () => {
        calls++;
        return calls === 1 ? HttpResponse.error() : HttpResponse.text("recovered");
      }),
    );

    await expect(fetchRawText("https://raw.example.test/flaky.ts")).rejects.toThrow();
    await expect(fetchRawText("https://raw.example.test/flaky.ts")).resolves.toBe("recovered");
    expect(calls).toBe(2);
  });
});
