import { graphql } from "@/gql";

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
