import { graphql } from "@/gql";

export const PageFieldFragment = graphql(`
  fragment PageFieldFragment on Page {
    slug
    title
    content
    language {
      code
      locale
      name
      slug
    }
    seo {
      ...PostTypeSeoFragment
    }
  }
`);

export const GetPagesBySlugs = graphql(`
  query GetPagesBySlugs($slugs: [String] = []) {
    pages(where: { nameIn: $slugs }) {
      nodes {
        ...PageFieldFragment
        translations {
          ...PageFieldFragment
        }
      }
    }
  }
`);
