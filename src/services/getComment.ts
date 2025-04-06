import type { RootQueryToCommentConnection, Maybe } from "@ts_types/generated/graphql";
import { fetchAPI } from "@services/fetchApi";

export const getCommentsById = async (
  contentId: number,
  first: number,
  after?: Maybe<string>,
): Promise<RootQueryToCommentConnection> => {
  const data = await fetchAPI(`
    {
      comments(
        where: {
          contentId: "${contentId}",
          ${import.meta.env.PROD ? "contentStatus: PUBLISH," : ""}
          orderby: COMMENT_DATE_GMT,
        },
        first: ${first},
        ${after ? `after: "${after}"` : ""}
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
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
      }
    }`);

  return data?.data?.comments;
};
