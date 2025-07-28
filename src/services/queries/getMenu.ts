import { graphql } from "@/gql";

/**
 * ID 2 = DE
 * ID 125 = EN
 */

export const GetMenuItems = graphql(`
  query GetMenuItems(
    $language: LanguageCodeFilterEnum = DE
    $location: MenuLocationEnum = PRIMARY_MENU
  ) {
    menuItems(where: { language: $language, location: $location, parentDatabaseId: 0 }) {
      nodes {
        label
        order
        path
        childItems {
          nodes {
            label
            order
            path
          }
        }
      }
    }
  }
`);

/**
 * GetMenuById
 *
 * Primary menu IDs:
 * 2 = DE
 * 125 = EN
 */
export const GetMenuById = graphql(`
  query GetMenuById($id: ID = "") {
    menu(idType: DATABASE_ID, id: $id) {
      menuItems(where: { parentDatabaseId: 0 }) {
        nodes {
          label
          order
          path
          childItems {
            nodes {
              label
              order
              path
            }
          }
        }
      }
    }
  }
`);
