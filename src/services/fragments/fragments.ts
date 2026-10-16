import { graphql } from "@/gql";

export const PostTypeSeoFragment = graphql(`
  fragment PostTypeSeoFragment on PostTypeSEO {
    title
    canonical
    metaDesc
    metaRobotsNofollow
    metaRobotsNoindex
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
  }
`);

export const UserSocials = graphql(`
  fragment UserSocials on User {
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
`);
