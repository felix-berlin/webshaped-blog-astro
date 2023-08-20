import type { RootQuery } from "@ts_types/generated/graphql";
import { fetchAPI } from "@services/fetchApi";

export const getCategoryBySlug = async (
  slug: string,
): Promise<RootQuery["categories"]> => {
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
};

/**
 * Receives all available categories
 *
 * @return  {object}
 */
export const getAllCategories = async (
  first = 10_000,
  exclude: number[] = [1], // 1 = allgemein
  orderby = "NAME",
  hideEmpty = true,
): Promise<RootQuery["categories"]> => {
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
};
