import { graphql } from "@/gql";

// TODO: add condition for test data
// SHOW_TEST_DATA ? "[DRAFT, PUBLISH]" : "[PUBLISH]",

/** Everything a post card (BlogPostPreview) and the RSS feed render. */
export const PostCardFields = graphql(`
  fragment PostCardFields on Post {
    title
    excerpt
    slug
    language {
      slug
    }
  }
`);

export const GetPostsPreview = graphql(`
  query GetPostsPreview(
    $first: Int = 10000
    $languages: [LanguageCodeEnum!] = [DE]
    $stati: [PostStatusEnum] = [PUBLISH]
    $field: PostObjectsConnectionOrderbyEnum = AUTHOR
    $order: OrderEnum = ASC
  ) {
    posts(
      first: $first
      where: { languages: $languages, stati: $stati, orderby: { field: $field, order: $order } }
    ) {
      nodes {
        ...PostCardFields
        dateGmt
        modifiedGmt
        slug
        language {
          slug
        }
        translations {
          slug
          language {
            slug
          }
        }
        seo {
          metaRobotsNoindex
        }
      }
    }
  }
`);

export const GetAllPostPreviewsByCategory = graphql(`
  query GetAllPostPreviewsByCategory(
    $exclude: [ID] = [1] # Allgemein
    $field: PostObjectsConnectionOrderbyEnum = DATE
    $order: OrderEnum = DESC
    $stati: [PostStatusEnum] = [PUBLISH]
    $first: Int = 10000
  ) {
    categories(where: { exclude: $exclude }) {
      nodes {
        name
        slug
        language {
          slug
        }
        posts(first: $first, where: { orderby: { field: $field, order: $order }, stati: $stati }) {
          nodes {
            ...PostCardFields
          }
        }
        translations {
          name
          slug
          posts(
            first: $first
            where: { orderby: { field: $field, order: $order }, stati: $stati }
          ) {
            nodes {
              ...PostCardFields
            }
          }
          language {
            slug
          }
        }
        # TaxonomySEO, so PostTypeSeoFragment can't be spread here.
        seo {
          title
          canonical
          metaDesc
          metaRobotsNofollow
          metaRobotsNoindex
          opengraphSiteName
          opengraphAuthor
          opengraphDescription
          opengraphPublisher
          opengraphTitle
          opengraphType
          opengraphUrl
          opengraphPublishedTime
          opengraphModifiedTime
          opengraphImage {
            sourceUrl
          }
          twitterDescription
          twitterTitle
        }
      }
    }
  }
`);
