import { graphql } from "@/gql";

const CategoryFields = graphql(`
  fragment CategoryFields on Category {
    count
    name
    slug
    language {
      code
      slug
      locale
    }
  }
`);

export const GetAllCategories = graphql(`
  query GetAllCategories(
    $first: Int = 10000
    $exclude: [ID] = [1, 96]
    $hideEmpty: Boolean = true
    $languages: [LanguageCodeEnum!] = [DE, EN]
    $orderby: TermObjectsConnectionOrderbyEnum = NAME
  ) {
    categories(
      first: $first
      where: { exclude: $exclude, orderby: $orderby, hideEmpty: $hideEmpty, languages: $languages }
    ) {
      nodes {
        ...CategoryFields
        children {
          nodes {
            ...CategoryFields
            children {
              nodes {
                ...CategoryFields
              }
            }
          }
        }
      }
    }
  }
`);
