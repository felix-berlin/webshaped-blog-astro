import type { RootQuery } from "@ts_types/generated/graphql";
import { fetchAPI } from "@services/fetchApi";
import { seo } from "@/services/fragments";

export const getCategoryBySlug = async (slug: string): Promise<RootQuery["categories"]> => {
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
        ${seo}
      }
    }
  }
  `).then((res) => res.data);
  return data?.categories?.nodes;
};

const categoryNodesContent = `
  count
  name
  slug
  language {
    code
    slug
    locale
  }
`;

/**
 * Receives all available categories
 *
 * @return  {object}
 */
export const getAllCategories = async (
  first = 10_000,
  exclude: string = "[1, 96]", // 1 = allgemein
  orderby = "NAME",
  hideEmpty = true,
  languages = "[DE, EN]",
): Promise<RootQuery["categories"]> => {
  const data = await fetchAPI(`
  {
    categories(
      first: ${first},
      where: {
        exclude: ${exclude},
        orderby: ${orderby},
        hideEmpty: ${hideEmpty},
        languages: ${languages}
      }) {
      nodes {
        ${categoryNodesContent}
        children {
          nodes {
            ${categoryNodesContent}
            children {
              nodes {
                ${categoryNodesContent}
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
