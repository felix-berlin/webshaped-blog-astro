// @ts-ignore: Unresolved import
import { filterObjectByKeys } from "@utils/objectHelpers";
import { it, expect, describe } from "vitest";

describe("filterObjectByKeys()", () => {
  it("returns only the specified keys from the object", () => {
    const object = { a: 1, b: 2, c: 3, d: 4 };
    const result = filterObjectByKeys(object, ["a", "c"]);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("returns empty object when filter array is empty", () => {
    const object = { a: 1, b: 2 };
    const result = filterObjectByKeys(object, []);
    expect(result).toEqual({});
  });

  it("returns empty object when no keys match", () => {
    const object = { a: 1, b: 2 };
    const result = filterObjectByKeys(object, ["x" as keyof typeof object, "y" as keyof typeof object]);
    expect(result).toEqual({});
  });

  it("throws error when object is null", () => {
    expect(() => filterObjectByKeys(null as unknown as object, [])).toThrowError(
      "Invalid input: object must be an object and cannot be null",
    );
  });

  it("throws error when object is not an object", () => {
    expect(() => filterObjectByKeys("not an object" as unknown as object, [])).toThrowError(
      "Invalid input: object must be an object and cannot be null",
    );
  });

  it("returns empty object when filter is not an array", () => {
    const object = { a: 1, b: 2 };
    const result = filterObjectByKeys(object, "a" as unknown as Array<keyof typeof object>);
    expect(result).toEqual({});
  });

  it("ignores keys not present in the object", () => {
    const object = { a: 1, b: 2 };
    const result = filterObjectByKeys(object, ["a", "z" as keyof typeof object]);
    expect(result).toEqual({ a: 1 });
  });

  it("handles nested objects", () => {
    const object = { a: { nested: true }, b: 2 };
    const result = filterObjectByKeys(object, ["a"]);
    expect(result).toEqual({ a: { nested: true } });
  });
});
