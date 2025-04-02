import type { Post, RootQueryToPostConnection } from "@ts_types/generated/graphql";
import { fetchAPI } from "@services/fetchApi";
import { allBlocks, coreDetails } from "./blockFragments";
import { SHOW_TEST_DATA } from "astro:env/client";

export const getAllPostsWithSlugs = async (
  languages = "[DE, EN]",
  stati = SHOW_TEST_DATA ? "[DRAFT, PUBLISH]" : "[PUBLISH]",
): Promise<RootQueryToPostConnection> => {
  const data = await fetchAPI(`
  {
    posts(first: 10000, where: {languages: ${languages}, stati: ${stati}}) {
      nodes {
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
      }
    }
  }
  `).then((res) => res.data);

  return data?.posts;
};

export const getPostBySlug = async (
  slug: number | string,
  authorAvatarSize = 96,
): Promise<Post> => {
  const data = await fetchAPI(`
    {
      post(id: "${slug}", idType: URI) {
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
          ${allBlocks}
          ${coreDetails(allBlocks)}
        }
        author {
          node {
            avatar(size: ${authorAvatarSize}) {
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
          where: {contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT, parent: 0}
        ) {
          nodes {
            content
            dateGmt
            id
            parentId
            commentId
            author {
              node {
                name
                id
                avatar {
                  foundAvatar
                  default
                  height
                  width
                  url
                }
              }
            }
            replies(where: {contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT}) {
              nodes {
                content
                dateGmt
                id
                parentId
                commentId
                author {
                  node {
                    name
                    id
                    avatar {
                      foundAvatar
                      height
                      size
                      url
                      width
                    }
                  }
                }
                replies(where: {contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT}) {
                  nodes {
                    content
                    dateGmt
                    id
                    parentId
                    commentId
                    author {
                      node {
                        name
                        id
                        avatar {
                          foundAvatar
                          height
                          size
                          url
                          width
                        }
                      }
                    }
                    replies(where: {contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT}) {
                      nodes {
                        content
                        dateGmt
                        id
                        parentId
                        commentId
                        author {
                          node {
                            name
                            id
                            avatar {
                              foundAvatar
                              height
                              size
                              url
                              width
                            }
                          }
                        }
                        replies(where: {contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT}) {
                          nodes {
                            content
                            dateGmt
                            id
                            parentId
                            commentId
                            author {
                              node {
                                name
                                id
                                avatar {
                                  foundAvatar
                                  height
                                  size
                                  url
                                  width
                                }
                              }
                            }
                            replies(where: {contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT}) {
                              nodes {
                                content
                                dateGmt
                                id
                                parentId
                                commentId
                                author {
                                  node {
                                    name
                                    id
                                    avatar {
                                      foundAvatar
                                      height
                                      size
                                      url
                                      width
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
  `).then((res) => res.data);

  return data?.post;
};

export const getAllRssPostsFromEachLang = async (
  languages = "[DE, EN]",
  stati = SHOW_TEST_DATA ? "[DRAFT, PUBLISH]" : "[PUBLISH]",
): Promise<RootQueryToPostConnection> => {
  const data = await fetchAPI(`
  {
    posts(first: 10000, where: {stati: ${stati}, languages: ${languages}}) {
      nodes {
        title
        slug
        excerpt
        dateGmt
        language {
          slug
        }
      }
    }
  }
  `).then((res) => res.data);

  return data?.posts;
};
