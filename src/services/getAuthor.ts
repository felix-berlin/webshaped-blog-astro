import type { RootQuery } from "@ts_types/generated/graphql";
import { fetchAPI } from "@services/fetchApi";

export const getAuthor = async (
  id = "1",
  idType = "DATABASE_ID",
): Promise<RootQuery["user"]> => {
  const data = await fetchAPI(`
    {
      user(id: "${id}", idType: ${idType}) {
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
          mastodon
        }
      }
    }`).then((res) => res.data);

  return data?.user;
};
