export const coreParagraph = `
  ... on CoreParagraph {
    name
    attributes {
      content
      align
    }
  }
`;

export const coreList = `
  ... on CoreList {
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
`;

export const coreHeading = `
  ... on CoreHeading {
    name
    attributes {
      align
      content
      level
      textAlign
    }
  }
`;

export const coreCode = `
  ... on CoreCode {
    name
    attributes {
      content
      align
      className
    }
  }
`;

const coreImage = `
  ... on CoreImage {
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
`;

const coreButton = `
  ... on CoreButton {
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
`;

const coreButtons = `
  ... on CoreButtons {
    name
    attributes {
      align
    }
    innerBlocks {
      ${coreButton}
    }
  }
`;

const acfGithubRawData = `
  ... on AcfGithubRawData {
    name
    githubRawData {
      codeLanguage
      githubRawUrl
    }
  }
`;

const acfCodeHighlighting = `
  ... on AcfCodeHighlighting {
    name
    attributes {
      data
    }
  }
`;

export const allBlocks =
  coreParagraph +
  coreList +
  coreHeading +
  coreCode +
  coreImage +
  coreButton +
  coreButtons +
  acfGithubRawData +
  acfCodeHighlighting;

export const coreDetails = (allInnerBlocks: string) => `
  ... on CoreDetails {
    name
    attributes {
      summary
      showContent
    }
    innerBlocks {
      ${allInnerBlocks}
    }
  }
`;
