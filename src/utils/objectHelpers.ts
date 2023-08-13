/**
 * Returns the given object without the given properties.
 *
 * example:
 * object = { a: 1, b: 2, c: 3, d: 4 }
 * excludeObjectKeys(object, ['a', 'c']) === { b: 2, d: 4 }
 *
 *
 * @param {object} object - Object to exclude properties from
 * @param {Array<string>} exclude - Properties to exclude
 * @returns {object}
 */
export const excludeObjectKeys = (
  object: object,
  exclude: string[],
): object => {
  if (typeof object !== "object" || object === null) {
    throw new Error(
      "Invalid input: object must be an object and cannot be null",
    );
  }

  if (!Array.isArray(exclude)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !exclude.includes(key)),
  );
};

/**
 * Returns only the given properties of the given object at the top level.
 *
 * example:
 * object = { a: 1, b: 2, c: 3, d: 4 }
 * filterObjectByKeys(object, ['a', 'c']) === { a: 1, c: 3 }
 *
 * @param {object} object - Object to filter properties from
 * @param {Array<string>} filter - Properties to filter
 * @returns {object}
 */
export const filterObjectByKeys = (
  object: object,
  filter: Array<string>,
): object => {
  if (typeof object !== "object" || object === null)
    throw new Error(
      "Invalid input: object must be an object and cannot be null",
    );

  if (!Array.isArray(filter)) return {};

  if (filter.length === 0) return {};

  const filteredObject = {};

  filter.forEach((key) => {
    if (key in object) {
      if (typeof object[key] === "object" && object[key] !== null) {
        // nested objects are not filtered
        filteredObject[key] = object[key];
      } else {
        filteredObject[key] = object[key];
      }
    }
  });

  return filteredObject;
};
