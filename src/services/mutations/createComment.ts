import { graphql } from "@/gql";

export const CreateComment = graphql(`
  mutation CreateComment(
    $author: String = ""
    $authorEmail: String = ""
    $content: String = ""
    $parent: ID = ""
    $commentOn: Int = 1
  ) {
    createComment(
      input: {
        author: $author
        authorEmail: $authorEmail
        commentOn: $commentOn
        content: $content
        parent: $parent
      }
    ) {
      comment {
        id
        content
        status
        isRestricted
        author {
          node {
            name
            email
          }
        }
      }
      success
    }
  }
`);
