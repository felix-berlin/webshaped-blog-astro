import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import { parse } from "@utils/helpers";

describe("parse()", () => {
  it("test_valid_json_string", () => {
    const str = '{"name":"John","age":30,"city":"New York"}';
    const result = parse(str);
    expect(result).toEqual({ name: "John", age: 30, city: "New York" });
  });

  it("test_empty_string", () => {
    const str = "";
    const result = parse(str);
    expect(result).toBeUndefined();
  });

  it("test_null", () => {
    const str = null;
    const result = parse(str);
    expect(result).toBeUndefined();
  });

  it("test_undefined", () => {
    const str = undefined;
    const result = parse(str);
    expect(result).toBeUndefined();
  });

  it("test_invalid_json_string", () => {
    const str = '{"name":"John","age":30,"city":"New York"';
    expect(() => parse(str)).toThrowError("Failed to parse JSON string");
  });
});
