const { PUBLIC_WP_API } = import.meta.env;

async function fetchAPI(query: string, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json', };

  return await fetch(PUBLIC_WP_API, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query, variables }),
  })
  .then((res) => res.json())
  .then((res) => res.data)
  .catch((err) => {
    console.error(err);
    throw new Error('Failed to fetch API');
   });
}

export async function getAllPagesWithSlugs() {
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

export async function getCategoryBySlug(slug:string) {
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
  `);
  return data?.categories?.nodes;
}

export async function getPageBySlug(slug:string) {
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
  `);
  return data?.page;
}

export async function getPrimaryMenu(lang='de') {
  const data = await fetchAPI(`
  {
    menus(where: {location: PRIMARY_MENU${lang === "en" ? '____EN' : ''} }) {
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
  `);
  return data?.menus?.nodes[0];
}

export async function getMenuById(id: number) {
  const data = await fetchAPI(`
  {
    menu(id: ${id}, idType: DATABASE_ID) {
      menuItems(where: {parentDatabaseId: 0}) {
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
  `);

  return data?.menu;
}


export async function getAllPostsWithSlugs() {
  const data = await fetchAPI(`
  {
    posts(first: 10000) {
      edges {
        node {
          slug
        }
      }
    }
  }
  `);

  return data?.posts;
}

export async function getPostBySlug(slug:string) {
  const data = await fetchAPI(`
    {
      post(id: "${slug}", idType: URI) {
        title
        excerpt
        dateGmt
        modifiedGmt
        content
        postId
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
  `)

  return data?.post;
}

export async function getAllPostsWithContent() {
  const data = await fetchAPI(`
    {
      posts(first: 10000) {
        edges {
          node {
            slug
            title
            excerpt
            dateGmt
            modifiedGmt
            featuredImage {
              node {
                altText
                mediaItemUrl
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
            content
          }
        }
      }
    }
  `)

  return data?.posts;
}

/**
 * Receives all available categories
 *
 * @return  {object}
 */
export async function getAllCategories() {
  const data = await fetchAPI(`
  {
    categories {
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
  `)

  return data?.categories;
}

export async function getAllTags() {
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
  `)

  return data?.tags;
}

export async function createComment(id:number, content:string, author:string, authorEmail: string) {
  return await fetchAPI(`
    mutation {
      createComment(input: {
        commentOn: ${id},
        content: "${content}",
        author: "${author}",
        authorEmail: ${authorEmail}
      }) {
        comment {
          id
          content
          author {
            node {
              name
              email
            }
          }
        }
      }
    }`
  );
}