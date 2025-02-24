import type { APIRoute } from "astro";
import { fetchAPI } from "@services/fetchApi";
import type { CreateCommentInput } from "@ts_types/generated/graphql";

/**
 * creates a new comment
 *
 * @export
 * @param {CreateCommentInput["commentOn"]} commentOn - id of the post
 * @param {CreateCommentInput["content"]} content - content of the comment
 * @param {CreateCommentInput["author"]} author - name of the author
 * @param {CreateCommentInput["authorEmail"]} [authorEmail] - email of the author
 * @param {CreateCommentInput["parent"]} [parent] - id of the parent comment
 * @return {*}  {Promise}
 */
export const createComment = async (
  commentOn: CreateCommentInput["commentOn"],
  content: CreateCommentInput["content"],
  author: CreateCommentInput["author"],
  authorEmail?: CreateCommentInput["authorEmail"],
  parent?: CreateCommentInput["parent"],
) => {
  return await fetchAPI(`
    mutation {
      createComment(input: {
        commentOn: ${commentOn},
        content: "${content}",
        author: "${author}",
        authorEmail: "${authorEmail}",
        parent: "${parent}"
      }) {
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
    }`);
};
