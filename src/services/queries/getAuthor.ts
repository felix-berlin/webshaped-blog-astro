import { graphql } from "@/gql";

export const GetAuthor = graphql(`
  query GetAuthor($id: ID = "1", $idType: UserNodeIdTypeEnum = DATABASE_ID) {
    user(id: $id, idType: $idType) {
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
  }
`);
