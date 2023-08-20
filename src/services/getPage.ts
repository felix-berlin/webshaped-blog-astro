import type { RootQuery } from "@ts_types/generated/graphql";
import { fetchAPI } from "@services/fetchApi";

export const getAllPagesWithSlugs = async (): Promise<RootQuery["pages"]> => {
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
};

export const getPageBySlug = async (
  slug: string,
): Promise<RootQuery["page"]> => {
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
};
