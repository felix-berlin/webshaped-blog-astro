import type {
  RootMutation,
  RootQuery,
  MenuItem,
  SeoUser,
  Post,
  RootQueryToCategoryConnection,
  RootQueryToCommentConnection,
  RootQueryToPostConnection,
  CreateCommentInput,
  CreateCommentPayload,
  Maybe,
} from "../types/generated/graphql";
const { PUBLIC_WP_API } = import.meta.env;

async function fetchAPI(
  query: string,
  { variables } = { variables: {} },
): Promise<object | any> {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  return await fetch(PUBLIC_WP_API, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  }).then(async (response) => {
    if (response.ok) {
      // console.log('response', response);

      return await response.json();
    } else {
      const errorMessage = await response.text();
      return Promise.reject(new Error(errorMessage));
    }
  });
}

export async function getAllPagesWithSlugs(): Promise<RootQuery["pages"]> {
  const data = await fetchAPI(`
  {
    pages(first: 10000) {
      edges {
        node {
          slug
        }
      }
    }
  }
  `);
  return data?.pages;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<RootQuery["categories"]> {
  const data = await fetchAPI(`
  {
    categories(first: 10000, where: {slug: "${slug}"}) {
      nodes {
        name
        slug
        count
        language {
          code
          locale
          name
          slug
        }
        seo {
          title
          canonical
          metaDesc
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
          metaRobotsNofollow
          metaRobotsNoindex
        }
      }
    }
  }
  `).then((res) => res.data);
  return data?.categories?.nodes;
}

export async function getPageBySlug(slug: string): Promise<RootQuery["page"]> {
  const data = await fetchAPI(`
  {
    page(id: "${slug}", idType: URI) {
      slug
      title
      content
      language {
        code
        locale
        name
      }
      seo {
        title
        readingTime
        canonical
        metaDesc
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
        metaRobotsNofollow
        metaRobotsNoindex
      }
    }
  }
  `).then((res) => res.data);
  return data?.page;
}

export async function getPrimaryMenu(lang = "de"): Promise<MenuItem> {
  const data = await fetchAPI(`
  {
    menus(where: {location: PRIMARY_MENU${lang === "en" ? "____EN" : ""} }) {
      nodes {
        menuItems {
          edges {
            node {
              path
              label
              connectedNode {
                node {
                  ... on Page {
                    isPostsPage
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `).then((res) => res.data);
  return data?.menus?.nodes[0];
}

export async function getMenuById(id: number): Promise<RootQuery["menu"]> {
  const data = await fetchAPI(`
  {
    menu(id: ${id}, idType: DATABASE_ID) {
      menuItems(where: {parentDatabaseId: 0,}) {
        nodes {
          label
          order
          path
          childItems {
            nodes {
              label
              order
              path
            }
          }
        }
      }
    }
  }
  `).then((res) => res.data);

  return data?.menu;
}

export async function getAllPostsWithSlugs(
  language = "DE",
): Promise<RootQueryToPostConnection> {
  const data = await fetchAPI(`
  {
    posts(first: 10000, where: {status: PUBLISH, language: ${language}}) {
      edges {
        node {
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
  }
  `).then((res) => res.data);

  return data?.posts;
}

export async function getPostBySlug(slug: number | string): Promise<Post> {
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
        blocks {
          attributesJSON
          name
          order
          originalContent
          innerBlocks {
            attributesJSON
            name
            order
            originalContent
          }
        }
        author {
          node {
            avatar {
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
              parent {
                node {
                  name
                }
              }
              children {
                edges {
                  node {
                    name
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
          metaRobotsNofollow
          metaRobotsNoindex
        }
      }
    }
  `).then((res) => res.data);

  return data?.post;
}

export async function getPostsPreview(
  first = 10_000,
  status = "PUBLISH",
  orderby = "DATE",
  order = "ASC",
  language = "DE",
): Promise<RootQuery["posts"]> {
  const data = await fetchAPI(`
    {
      posts(first: ${first}, where: {language: ${language}, status: ${status}, orderby: {field: ${orderby}, order: ${order}}}) {
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
  `).then((res) => res.data);

  return data?.posts;
}

/**
 * Receives all available categories
 *
 * @return  {object}
 */
export async function getAllCategories(
  first = 10_000,
  exclude: number[] = [1], // 1 = allgemein
  orderby = "NAME",
  hideEmpty = true,
): Promise<RootQuery["categories"]> {
  const data = await fetchAPI(`
  {
    categories(first: ${first}, where: {exclude: ${exclude}, orderby: ${orderby}, hideEmpty: ${hideEmpty}}) {
      nodes {
        count
        name
        slug
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
              }
            }
          }
        }
      }
    }
  }
  `).then((res) => res.data);

  return data?.categories;
}

export async function getPostsPreviewByCategory(
  category: string,
  first = 10_000,
  field = "DATE",
  order = "ASC",
): Promise<RootQuery["posts"]> {
  const data = await fetchAPI(`
  {
    posts(
      first: ${first},
      where: {categoryName: "${category}", orderby: {field: ${field}, order: ${order}}, status: PUBLISH}
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
  `).then((res) => res.data);

  return data?.posts;
}

export async function getAllPostPreviewsByCategory(
  field = "DATE",
  order = "ASC",
  status = "PUBLISH",
  exclude: number[] = [1], // 1 = allgemein
): Promise<RootQueryToCategoryConnection> {
  const data = await fetchAPI(`
  {
    categories(where: {exclude: ${exclude}}) {
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
        children(where: {}) {
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
        posts(where: {orderby: {order: ${order}, field: ${field}}, status: ${status}}) {
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
      }
    }
  }
  `).then((res) => res.data);

  return data?.categories;
}

/**
 * receives all available tags from API
 *
 * @return  {object}
 */
export async function getAllTags(): Promise<RootQuery["tags"]> {
  const data = await fetchAPI(`
  {
    tags {
      nodes {
        count
        name
        slug
      }
    }
  }
  `).then((res) => res.data);

  return data?.tags;
}

export async function getAuthor(
  id = "1",
  idType = "DATABASE_ID",
): Promise<RootQuery["user"]> {
  const data = await fetchAPI(`
    {
      user(id: "${id}", idType: DATABASE_ID) {
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
        }
      }
    }`).then((res) => res.data);

  return data?.user;
}

export async function getCommentsById(
  contentId: number,
  first: number,
  after?: Maybe<string>,
): Promise<RootQueryToCommentConnection> {
  return await fetchAPI(`
    {
      comments(
        where: {
          contentId: "${contentId}",
          contentStatus: PUBLISH,
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
}

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
export async function createComment(
  commentOn: CreateCommentInput["commentOn"],
  content: CreateCommentInput["content"],
  author: CreateCommentInput["author"],
  authorEmail?: CreateCommentInput["authorEmail"],
  parent?: CreateCommentInput["parent"],
): Promise<object> {
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
}
