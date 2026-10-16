import { getHtmlContent, headingId, isHtml } from "@utils/helpers";

import { graphql, useFragment } from "@/gql";

export const CoreParagraph = graphql(`
  fragment CoreParagraph on CoreParagraph {
    name
    attributes {
      content
      align
    }
  }
`);

export const CoreListItem = graphql(`
  fragment CoreListItem on CoreListItem {
    attributes {
      content
    }
  }
`);

// GraphQL fragments can't recurse, so one level of nested lists is selected explicitly.
export const CoreList = graphql(`
  fragment CoreList on CoreList {
    name
    attributes {
      ordered
    }
    innerBlocks {
      ...CoreListItem
      ... on CoreListItem {
        innerBlocks {
          ... on CoreList {
            attributes {
              ordered
            }
            innerBlocks {
              ...CoreListItem
            }
          }
        }
      }
    }
  }
`);

export const CoreHeading = graphql(`
  fragment CoreHeading on CoreHeading {
    name
    attributes {
      align
      content
      level
    }
  }
`);

export const CoreCode = graphql(`
  fragment CoreCode on CoreCode {
    name
    attributes {
      content
      align
      className
    }
  }
`);

export const CoreImage = graphql(`
  fragment CoreImage on CoreImage {
    name
    attributes {
      align
      alt
      aspectRatio
      caption
      height
      id
      sizeSlug
      src
      title
      width
    }
    mediaDetails {
      height
      width
    }
  }
`);

export const CoreButton = graphql(`
  fragment CoreButton on CoreButton {
    name
    attributes {
      text
      type
      url
      title
      linkTarget
      rel
    }
  }
`);

export const CoreButtons = graphql(`
  fragment CoreButtons on CoreButtons {
    name
    attributes {
      align
    }
    innerBlocks {
      ...CoreButton
    }
  }
`);

export const AcfGithubRawData = graphql(`
  fragment AcfGithubRawData on AcfGithubRawData {
    name
    githubRawData {
      codeLanguage
      githubRawUrl
    }
  }
`);

export const AcfCodeHighlighting = graphql(`
  fragment AcfCodeHighlighting on AcfCodeHighlighting {
    name
    attributes {
      data
    }
  }
`);

export const CoreDetails = graphql(`
  fragment CoreDetails on CoreDetails {
    name
    attributes {
      summary
      showContent
    }
    innerBlocks {
      name
      ...AllBlocks
    }
  }
`);

export const AllBlocks = graphql(`
  fragment AllBlocks on EditorBlock {
    ...CoreParagraph
    ...CoreList
    ...CoreHeading
    ...CoreCode
    ...CoreImage
    ...CoreButton
    ...CoreButtons
    ...AcfGithubRawData
    ...AcfCodeHighlighting
  }
`);

export interface TocHeading {
  content: string;
  /** Anchor id, identical to the one HeadlineBlock renders. */
  id: string;
  level: number;
  /** Bound onto the TOC link; computed here so the client islands need no HTML parsing. */
  linkAttrs: { innerHTML: string } | { textContent: string };
}

/** The h2/h3 headings of a post's top-level blocks, for the table of contents. */
export const tocHeadings = (blocks: ReadonlyArray<null | { name?: null | string }>): TocHeading[] =>
  blocks.flatMap((block) => {
    if (block?.name !== "core/heading") return [];
    const { content, level } = useFragment(CoreHeading, block as never).attributes ?? {};
    if (!content || (level !== 2 && level !== 3)) return [];
    const linkAttrs = isHtml(content)
      ? { textContent: getHtmlContent(content) }
      : { innerHTML: content };
    return [{ content, id: headingId(content), level, linkAttrs }];
  });
