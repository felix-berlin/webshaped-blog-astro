import { graphql } from "@/gql";

export const CommentFields = graphql(`
  fragment CommentFields on Comment {
    content
    dateGmt
    id
    parentId
    parentDatabaseId
    author {
      node {
        name
        id
        avatar {
          foundAvatar
          height
          width
          url
        }
      }
    }
  }
`);

export const GetCommentsById = graphql(`
  query GetCommentsById(
    $contentId: ID = ""
    $contentStatus: [PostStatusEnum] = PUBLISH
    $orderby: CommentsConnectionOrderbyEnum = COMMENT_DATE_GMT
    $first: Int = 10
    $after: String = ""
  ) {
    comments(
      where: { contentId: $contentId, contentStatus: $contentStatus, orderby: $orderby }
      first: $first
      after: $after
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ...CommentFields
          replies(where: { contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT }) {
            nodes {
              ...CommentFields
              replies(where: { contentStatus: PUBLISH, orderby: COMMENT_DATE_GMT }) {
                nodes {
                  ...CommentFields
                }
              }
            }
          }
        }
      }
    }
  }
`);
