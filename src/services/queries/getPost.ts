import { graphql } from "@/gql";

// TODO: add condition for test data
// SHOW_TEST_DATA ? "[DRAFT, PUBLISH]" : "[PUBLISH]",

export const GetAllPosts = graphql(`
  query GetAllPosts(
    $first: Int = 10000
    $languages: [LanguageCodeEnum!] = [DE, EN]
    $stati: [PostStatusEnum] = [PUBLISH]
    $size: Int = 96
  ) {
    posts(first: $first, where: { languages: $languages, stati: $stati }) {
      nodes {
        title
        slug
        dateGmt
        modifiedGmt
        postId
        editorBlocks(flat: false) {
          name
          ...CoreDetails
          ...AllBlocks
        }
        author {
          node {
            avatar(size: $size) {
              height
              url
              width
            }
            firstName
            lastName
            description
            id
            ...UserSocials
          }
        }
        featuredImage {
          node {
            altText
            mediaItemUrl
            mediaDetails {
              height
              width
            }
          }
        }
        categories {
          edges {
            node {
              name
              slug
              parent {
                node {
                  name
                  slug
                }
              }
              children {
                edges {
                  node {
                    name
                    slug
                  }
                }
              }
            }
          }
        }
        language {
          slug
        }
        seo {
          readingTime
          ...PostTypeSeoFragment
        }
        translations {
          slug
          language {
            slug
            name
          }
        }
      }
    }
  }
`);
