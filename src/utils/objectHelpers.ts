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
  object: Record<string, unknown>,
  exclude: string[],
): Record<string, unknown> => {
  if (typeof object !== "object" || object === null) {
    throw new Error(
      "Invalid input: object must be an object and cannot be null",
    );
  }

  if (!Array.isArray(exclude) || exclude.length === 0) {
    return object;
  }

  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !exclude.includes(key)),
  );
};

type FilteredObject<T, K extends keyof T> = {
  [P in K]: T[P];
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
export const filterObjectByKeys = <T, K extends keyof T>(
  object: T,
  filter: K[],
): FilteredObject<T, K> => {
  if (typeof object !== "object" || object === null)
    throw new Error(
      "Invalid input: object must be an object and cannot be null",
    );

  if (!Array.isArray(filter)) return {} as FilteredObject<T, K>;

  if (filter.length === 0) return {} as FilteredObject<T, K>;

  const filteredObject = {} as FilteredObject<T, K>;

  filter.forEach((key) => {
    if (key in object) {
      filteredObject[key] = object[key];
    }
  });

  return filteredObject;
};
