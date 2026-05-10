import { graphql } from "@/gql";

export const CoreParagraph = graphql(`
  fragment CoreParagraph on CoreParagraph {
    name
    attributes {
      content
      align
    }
  }
`);

export const CoreList = graphql(`
  fragment CoreList on CoreList {
    name
    innerBlocks {
      name
      ... on CoreListItem {
        attributes {
          content
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
      textAlign
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
      sizes {
        sourceUrl
        file
        fileSize
        height
        mimeType
        name
        width
      }
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
      textAlign
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

export const CoreDetails = (_allInnerBlocks: string) =>
  graphql(`
    fragment CoreDetails on CoreDetails {
      name
      attributes {
        summary
        showContent
      }
      innerBlocks {
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
