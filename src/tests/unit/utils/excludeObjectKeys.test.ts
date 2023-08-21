import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import { excludeObjectKeys } from "@utils/objectHelpers";

describe("excludeObjectKeys", () => {
  // Tests that the function returns the object unchanged if the exclude array is empty
  it("should return the object unchanged when the exclude array is empty", () => {
    const object = { a: 1, b: 2, c: 3, d: 4 };
    const exclude = [];
    const result = excludeObjectKeys(object, exclude);
    expect(result).toEqual(object);
  });

  // Tests that the function returns a new object without the excluded properties
  it("should return a new object without the excluded properties", () => {
    const object = { a: 1, b: 2, c: 3, d: 4 };
    const exclude = ["a", "c"];
    const result = excludeObjectKeys(object, exclude);
    expect(result).toEqual({ b: 2, d: 4 });
  });

  // Tests that the function throws an error if the object is null
  it("should throw an error when the object is null", () => {
    const object = null;
    const exclude = ["a", "c"];
    expect(() => excludeObjectKeys(object, exclude)).toThrowError(
      "Invalid input: object must be an object and cannot be null",
    );
  });

  // Tests that the function throws an error if the object is not an object
  it("should throw an error when the object is not an object", () => {
    const object = "not an object";
    const exclude = ["a", "c"];
    expect(() => excludeObjectKeys(object, exclude)).toThrowError(
      "Invalid input: object must be an object and cannot be null",
    );
  });

  // Tests that the function returns an empty object if all properties are excluded
  it("should return an empty object when all properties are excluded", () => {
    const object = { a: 1, b: 2, c: 3, d: 4 };
    const exclude = ["a", "b", "c", "d"];
    const result = excludeObjectKeys(object, exclude);
    expect(result).toEqual({});
  });

  // Tests that the function returns an empty object if the object is empty
  it("should return an empty object when the object is empty", () => {
    const object = {};
    const exclude = ["a", "c"];
    const result = excludeObjectKeys(object, exclude);
    expect(result).toEqual({});
  });
});
