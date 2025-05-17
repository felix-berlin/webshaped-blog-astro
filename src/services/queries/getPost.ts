// import { SHOW_TEST_DATA } from "astro:env/client";
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
        excerpt
        dateGmt
        modifiedGmt
        content
        postId
        id
        editorBlocks(flat: false) {
          apiVersion
          blockEditorCategoryName
          clientId
          name
          parentClientId
          type
          ...CoreDetails
          ...AllBlocks
        }
        author {
          node {
            avatar(size: $size) {
              foundAvatar
              height
              url
              width
            }
            email
            firstName
            lastName
            description
            id
            seo {
              social {
                facebook
                instagram
                linkedIn
                mySpace
                pinterest
                soundCloud
                twitter
                wikipedia
                youTube
              }
            }
            socialAdvanced {
              github
              mastodon
            }
          }
        }
        featuredImage {
          node {
            altText
            mediaItemUrl
            srcSet
            sizes
            mimeType
            mediaDetails {
              height
              width
              sizes {
                width
                sourceUrl
                mimeType
              }
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
        commentCount
        commentStatus
        comments(
          first: 100
          where: { contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT, parent: 0 }
        ) {
          nodes {
            ...CommentDetails
            replies(where: { contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT }) {
              nodes {
                ...CommentDetails
                replies(where: { contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT }) {
                  nodes {
                    ...CommentDetails
                    replies(where: { contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT }) {
                      nodes {
                        ...CommentDetails
                        replies(where: { contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT }) {
                          nodes {
                            ...CommentDetails
                            replies(where: { contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT }) {
                              nodes {
                                ...CommentDetails
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        language {
          code
          locale
          name
          slug
        }
        seo {
          title
          readingTime
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
