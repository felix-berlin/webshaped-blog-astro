const { WP_API } = import.meta.env;

async function fetchAPI(query: string, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const res = await fetch(WP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.log(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
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

export async function getPageBySlug(slug) {
  const data = await fetchAPI(`
  {
    page(id: "${slug}", idType: URI) {
      title
      content
    }
  }
  `);
  return data?.page;
}

export async function getPrimaryMenu() {
  const data = await fetchAPI(`
  {
    menus(where: {location: PRIMARY_MENU}) {
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
        content
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