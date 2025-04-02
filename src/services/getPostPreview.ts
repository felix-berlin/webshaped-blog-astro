import type { RootQuery, RootQueryToCategoryConnection } from "@ts_types/generated/graphql";
import { fetchAPI } from "@services/fetchApi";
import { SHOW_TEST_DATA } from "astro:env/client";

export const getPostsPreview = async (
  first = 10_000,
  stati = SHOW_TEST_DATA ? "[DRAFT, PUBLISH]" : "[PUBLISH]",
  orderby = "DATE",
  order = "DESC",
  language = "DE",
): Promise<RootQuery["posts"]> => {
  const data = await fetchAPI(`
    {
      posts(first: ${first}, where: {language: ${language}, stati: ${stati}, orderby: {field: ${orderby}, order: ${order}}}) {
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
  order = "DESC",
  stati = SHOW_TEST_DATA ? "[DRAFT, PUBLISH]" : "[PUBLISH]",
): Promise<RootQuery["posts"]> => {
  const data = await fetchAPI(`
  {
    posts(
      first: ${first},
      where: {categoryName: "${category}", orderby: {field: ${field}, order: ${order}}, stati: ${stati}}
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
  order = "DESC",
  stati = SHOW_TEST_DATA ? "[DRAFT, PUBLISH]" : "[PUBLISH]",
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
        posts(where: {orderby: {order: ${order}, field: ${field}}, stati: ${stati}}) {
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
        translations {
          name
          slug
          posts(where: {orderby: {order: ${order}, field: ${field}}, stati: ${stati}}) {
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
          language {
            slug
          }
        }
      }
    }
  }
  `).then((res) => res.data);

  return data?.categories;
}
