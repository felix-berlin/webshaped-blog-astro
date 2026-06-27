// @ts-ignore: Unresolved import
import { capitalize } from "@utils/helpers";
import { it, expect, describe } from "vitest";

describe("capitalize()", () => {
  // Tests that the function correctly capitalizes a string with only one character
  it("should capitalize a string with only one character", () => {
    const result = capitalize("a");
    expect(result).toBe("A");
  });

  // Tests that the function correctly capitalizes a string with multiple characters
  it("should capitalize a string with multiple characters", () => {
    const result = capitalize("hello");
    expect(result).toBe("Hello");
  });

  // Tests that the function correctly capitalizes a string with leading and trailing whitespaces
  it("should capitalize a string with leading and trailing whitespaces", () => {
    const result = capitalize("  hello  ");
    expect(result).toBe("Hello");
  });

  // Tests that the function correctly capitalizes a string with all uppercase characters
  it("should capitalize a string with all uppercase characters", () => {
    const result = capitalize("HELLO");
    expect(result).toBe("HELLO");
  });

  // Tests that the function returns an empty string when the input is null
  it("should return an empty string when the input is null", () => {
    const result = capitalize(null);
    expect(result).toBe("");
  });

  // Tests that the function returns an empty string when the input is not a string
  it("should return an empty string when the input is not a string", () => {
    const result = capitalize(123);
    expect(result).toBe("");
  });

  // Tests that a string starting with a non-letter character is returned unchanged (first char)
  it("should return string unchanged when first char is not a letter", () => {
    const result = capitalize("1abc");
    expect(result).toBe("1abc");
  });

  it("should return string starting with special char unchanged", () => {
    const result = capitalize("!hello");
    expect(result).toBe("!hello");
  });
});
