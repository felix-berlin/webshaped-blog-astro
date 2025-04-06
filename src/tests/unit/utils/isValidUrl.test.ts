import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import { isValidUrl } from "@utils/helpers";

describe("isValidUrl()", () => {
  // Tests that the function correctly identifies a valid URL with the http protocol
  it("should return true when given a valid URL with the http protocol", () => {
    const url = "http://www.example.com";
    const result = isValidUrl(url);
    expect(result).toBe(true);
  });

  // Tests that the function correctly identifies a valid URL with the https protocol
  it("should return true when given a valid URL with the https protocol", () => {
    const url = "https://www.example.com";
    const result = isValidUrl(url);
    expect(result).toBe(true);
  });

  // Tests that the function correctly identifies a valid URL with query parameters
  it("should return true when given a valid URL with query parameters", () => {
    const url = "http://www.example.com?param1=value1&param2=value2";
    const result = isValidUrl(url);
    expect(result).toBe(true);
  });

  // Tests that the function correctly identifies a valid URL with a hash fragment
  it("should return true when given a valid URL with a hash fragment", () => {
    const url = "http://www.example.com#section1";
    const result = isValidUrl(url);
    expect(result).toBe(true);
  });

  // Tests that the function correctly identifies an empty string as an invalid URL
  it("should return false when given an empty string", () => {
    const url = "";
    const result = isValidUrl(url);
    expect(result).toBe(false);
  });

  // Tests that the function correctly identifies a null value as an invalid URL
  it("should return false when given a null value", () => {
    const url = null;
    const result = isValidUrl(url);
    expect(result).toBe(false);
  });
});
