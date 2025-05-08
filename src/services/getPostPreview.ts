import { graphql } from "@/gql";

// TODO: add condition for test data
// SHOW_TEST_DATA ? "[DRAFT, PUBLISH]" : "[PUBLISH]",

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
        dateGmt
        modifiedGmt
        slug
        commentCount
        excerpt
        title
        language {
          code
          locale
          name
          slug
        }
        translations {
          slug
          language {
            code
            locale
            name
            slug
          }
        }
        featuredImage {
          node {
            altText
            mediaItemUrl
            srcSet
            sizes
            mediaDetails {
              height
              width
            }
          }
        }
        seo {
          readingTime
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
  ) {
    categories(where: { exclude: $exclude }) {
      nodes {
        count
        name
        slug
        language {
          code
          locale
          name
          slug
        }
        children {
          nodes {
            count
            name
            slug
            children {
              nodes {
                count
                name
                slug
                id
              }
            }
          }
        }
        posts(where: { orderby: { field: $field, order: $order }, stati: $stati }) {
          nodes {
            title
            excerpt
            language {
              code
              locale
              name
              slug
            }
            slug
          }
        }
        translations {
          name
          slug
          posts(where: { orderby: { field: $field, order: $order }, stati: $stati }) {
            nodes {
              title
              excerpt
              language {
                code
                locale
                name
                slug
              }
              slug
            }
          }
          language {
            slug
          }
        }
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
