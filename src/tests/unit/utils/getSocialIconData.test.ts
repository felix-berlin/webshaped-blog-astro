import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import { getSocialIconData } from "@utils/helpers";

describe("getSocialIconData", () => {
  // Tests that the function returns an object with social items and their urls
  it("should return an object with social items and their urls", () => {
    const socials = {
      facebook: "https://www.facebook.com",
      twitter: "https://www.twitter.com",
      instagram: "https://www.instagram.com",
    };
    const iconStyles = { color: "blue" };
    const additionalData = {};

    const result = getSocialIconData(socials, iconStyles, additionalData);

    expect(result).toEqual({
      facebook: { url: "https://www.facebook.com", color: "blue" },
      twitter: { url: "https://www.twitter.com", color: "blue" },
      instagram: { url: "https://www.instagram.com", color: "blue" },
    });
  });

  // Tests that the function includes icon styles and additional data if available
  it("should include icon styles and additional data if available", () => {
    const socials = {
      facebook: "https://www.facebook.com",
      twitter: "https://www.twitter.com",
    };
    const iconStyles = { color: "blue" };
    const additionalData = {
      facebook: { label: "Facebook" },
      twitter: { label: "Twitter" },
    };

    const result = getSocialIconData(socials, iconStyles, additionalData);

    expect(result).toEqual({
      facebook: {
        url: "https://www.facebook.com",
        color: "blue",
        label: "Facebook",
      },
      twitter: {
        url: "https://www.twitter.com",
        color: "blue",
        label: "Twitter",
      },
    });
  });

  // Tests that the function handles an empty socials object
  it("should handle an empty socials object", () => {
    const socials = {};
    const iconStyles = { color: "blue" };
    const additionalData = {};

    const result = getSocialIconData(socials, iconStyles, additionalData);

    expect(result).toEqual({});
  });

  // Tests that the function ignores social items with empty values
  it("should ignore social items with empty values", () => {
    const socials = {
      facebook: "",
      twitter: "https://www.twitter.com",
      instagram: null,
    };
    const iconStyles = { color: "blue" };
    const additionalData = {};

    const result = getSocialIconData(socials, iconStyles, additionalData);

    expect(result).toEqual({
      twitter: { url: "https://www.twitter.com", color: "blue" },
    });
  });

  // Tests that the function overwrites icon styles with additional data if there is a key collision
  it("should overwrite icon styles with additional data if there is a key collision", () => {
    const socials = {
      facebook: "https://www.facebook.com",
    };
    const iconStyles = { color: "blue" };
    const additionalData = {
      facebook: { color: "red" },
    };

    const result = getSocialIconData(socials, iconStyles, additionalData);

    expect(result).toEqual({
      facebook: { url: "https://www.facebook.com", color: "red" },
    });
  });

  // Tests that the function returns an empty object if socials is undefined or null
  it("should return an empty object if socials is undefined or null", () => {
    const socials = undefined;
    const iconStyles = { color: "blue" };
    const additionalData = {};

    const result = getSocialIconData(socials, iconStyles, additionalData);

    expect(result).toEqual({});
  });
});
