import type {
  RootQuery,
  RootQueryToCategoryConnection,
} from "@ts_types/generated/graphql";
import { fetchAPI } from "@services/fetchApi";

export const getPostsPreview = async (
  first = 10_000,
  status = "PUBLISH",
  orderby = "DATE",
  order = "ASC",
  language = "DE",
): Promise<RootQuery["posts"]> => {
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
};

export const getPostsPreviewByCategory = async (
  category: string,
  first = 10_000,
  field = "DATE",
  order = "ASC",
): Promise<RootQuery["posts"]> => {
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
};

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
