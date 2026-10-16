import { UserSocials } from "@services/fragments/fragments";
import { getSocialIconData } from "@utils/helpers";

import { type FragmentType, useFragment } from "@/gql";

// Kept out of helpers.ts on purpose: the runtime `@/gql` import carries every
// GraphQL document, and helpers.ts is also bundled into client islands.

// GitHub and Mastodon link back to this site, so they get rel="me" (IndieWeb identity).
const REL_ME_SOCIALS = { github: { rel: "me" }, mastodon: { rel: "me" } };

/** Social icon data for an author's Yoast socials plus the custom GitHub/Mastodon fields. */
export const getAuthorSocialItems = (
  author: FragmentType<typeof UserSocials> | null | undefined,
  size: number,
): ReturnType<typeof getSocialIconData> => {
  const socials = useFragment(UserSocials, author);
  return getSocialIconData(
    { ...socials?.seo?.social, ...socials?.socialAdvanced } as Parameters<
      typeof getSocialIconData
    >[0],
    { size },
    REL_ME_SOCIALS,
  );
};
