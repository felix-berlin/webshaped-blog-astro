import { PostTypeSeoFragment } from "@services/fragments/fragments";

import type { GetPagesBySlugsQuery } from "@/gql/graphql.ts";

import { graphql, useFragment } from "@/gql";

export const PageFieldFragment = graphql(`
  fragment PageFieldFragment on Page {
    slug
    title
    content @include(if: $withContent)
    language {
      code
      locale
      name
      slug
    }
    seo {
      ...PostTypeSeoFragment
    }
  }
`);

export const GetPagesBySlugs = graphql(`
  # withContent: false skips the page HTML where only title/SEO/language are needed.
  query GetPagesBySlugs($slugs: [String] = [], $withContent: Boolean = true) {
    pages(where: { nameIn: $slugs }) {
      nodes {
        ...PageFieldFragment
        translations {
          ...PageFieldFragment
        }
      }
    }
  }
`);

type PageNode = NonNullable<GetPagesBySlugsQuery["pages"]>["nodes"][number];

/** Unmasks a `GetPagesBySlugs` node into its language variants: the page itself, then its translations. */
export const pageVariants = (node: PageNode) =>
  [node, ...(node.translations ?? [])]
    .filter((variant) => variant != null)
    .map((variant) => {
      const page = useFragment(PageFieldFragment, variant);
      return { ...page, seo: useFragment(PostTypeSeoFragment, page.seo) };
    });
