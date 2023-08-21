import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import { getHostName } from "@utils/helpers";

describe("getHostName()", () => {
  // Tests that the function returns the domain name when a valid URL is passed as an argument.
  it("should return the domain name when a valid URL is passed as an argument", () => {
    const url = "https://www.example.com";
    const result = getHostName(url);
    expect(result).toBe("www.example.com");
  });

  // Tests that the function returns the domain name when a valid URL with subdomain is passed as an argument.
  it("should return the domain name when a valid URL with subdomain is passed as an argument", () => {
    const url = "https://subdomain.example.com";
    const result = getHostName(url);
    expect(result).toBe("subdomain.example.com");
  });

  // Tests that the function returns the domain name when a valid URL with port is passed as an argument.
  it("should return the domain name when a valid URL with port is passed as an argument", () => {
    const url = "https://example.com:8080";
    const result = getHostName(url);
    expect(result).toBe("example.com");
  });

  // Tests that the function throws an error when an empty string is passed as an argument.
  it("should throw an error when an empty string is passed as an argument", () => {
    const url = "";
    expect(() => {
      getHostName(url);
    }).toThrowError("Invalid URL");
  });

  // Tests that the function throws an error when an invalid URL is passed as an argument.
  it("should throw an error when an invalid URL is passed as an argument", () => {
    const url = "invalid-url";
    expect(() => {
      getHostName(url);
    }).toThrowError("Invalid URL");
  });

  // Tests that the function throws an error when a URL with an invalid protocol is passed as an argument.
  it("should throw an error when a URL with an invalid protocol is passed as an argument", () => {
    const url = "ftp://example.com";
    expect(() => {
      getHostName(url);
    }).toThrowError("Invalid URL");
  });
});
