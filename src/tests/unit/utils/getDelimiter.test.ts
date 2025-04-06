import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import { getDelimiter } from "@utils/helpers";

describe("getDelimiter()", () => {
  // Tests that the function returns the correct special character if found in the string
  it("should return the correct special character when it is found in the string", () => {
    const str = "Hello_World";
    const specialChars = ["_", "-", "*"];
    const result = getDelimiter(str, specialChars);
    expect(result).toBe("_");
  });

  // Tests that the function returns null if no special character is found in the string
  it("should return null when no special character is found in the string", () => {
    const str = "HelloWorld";
    const specialChars = ["_", "-", "*"];
    const result = getDelimiter(str, specialChars);
    expect(result).toBeNull();
  });

  // Tests that the function uses default special characters if none are provided
  it("should use default special characters if none are provided", () => {
    const str = "Hello-World";
    const result = getDelimiter(str);
    expect(result).toBe("-");
  });

  // Tests that the function returns null if an empty string is passed as input
  it("should return null when an empty string is passed as input", () => {
    const str = "";
    const specialChars = ["_", "-", "*"];
    const result = getDelimiter(str, specialChars);
    expect(result).toBeNull();
  });

  // Tests that the function returns null if an array of special characters is passed as input but none are found in the string
  it("should return null when an array of special characters is passed as input but none are found in the string", () => {
    const str = "HelloWorld";
    const specialChars = ["_", "-", "*"];
    const result = getDelimiter(str, specialChars);
    expect(result).toBeNull();
  });

  // Tests that the function returns null if a non-array value is passed as the specialChars parameter
  it("should return null when a non-array value is passed as the specialChars parameter", () => {
    const str = "Hello_World";
    const specialChars = "abc";
    const result = getDelimiter(str, specialChars);
    expect(result).toBeNull();
  });
});
