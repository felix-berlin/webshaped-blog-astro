import type { RootQuery } from "@ts_types/generated/graphql";
import { fetchAPI } from "@services/fetchApi";

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
