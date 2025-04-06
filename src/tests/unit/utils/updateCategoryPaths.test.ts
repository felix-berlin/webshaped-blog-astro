import { it, expect, describe } from "vitest";
// @ts-ignore: Unresolved import
import { updateCategoryPaths } from "@utils/helpers";

describe("updateCategoryPaths", () => {
  it("updates category paths in the main menu", () => {
    const mainMenuItems = {
      nodes: [
        {
          label: "Test Menu",
          order: 7,
          path: "/de/test-menu",
          childItems: {
            nodes: [
              {
                path: "/category1",
              },
              {
                path: "/category2",
              },
            ],
          },
        },
      ],
    };

    const updatedMenuItems = updateCategoryPaths(mainMenuItems, "de");

    expect(updatedMenuItems.nodes[0].childItems.nodes[0].path).toBe("/de/category1/1");
    expect(updatedMenuItems.nodes[0].childItems.nodes[1].path).toBe("/de/category2/1");
  });

  it("does not update paths that are not category paths", () => {
    const mainMenuItems = {
      nodes: [
        {
          label: "Test Menu",
          order: 7,
          path: "/de/test-menu",
          childItems: {
            nodes: [
              {
                path: "/category1",
              },
              {
                path: "/product2",
              },
            ],
          },
        },
      ],
    };

    const updatedMenuItems = updateCategoryPaths(mainMenuItems, "de");

    expect(updatedMenuItems.nodes[0].childItems.nodes[0].path).toBe("/de/category1/1");
    expect(updatedMenuItems.nodes[0].childItems.nodes[1].path).toBe("/product2");
  });

  it("returns null if mainMenuItems is null", () => {
    const mainMenuItems = null;

    const updatedMenuItems = updateCategoryPaths(mainMenuItems, "de");

    expect(updatedMenuItems).toBeNull();
  });
});
