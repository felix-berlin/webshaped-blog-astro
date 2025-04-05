import { fetchAPI } from "@services/fetchApi";
import type { RootQuery, MenuItem } from "@ts_types/generated/graphql";

export const getPrimaryMenu = async (lang = "de"): Promise<MenuItem> => {
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
};

export const getMenuById = async (id: number): Promise<RootQuery["menu"]> => {
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
};

export const getMenuItems = async (lang: string, location: string) => {
  const data = await fetchAPI(`
  {
    menuItems(where: {language: ${lang}, location: ${location}, parentDatabaseId: 0}) {
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
  `).then((res) => res.data);

  return data?.menuItems;
};
