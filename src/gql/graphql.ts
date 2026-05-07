/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** Moderation state for user comments. Determines whether comments are publicly visible, pending approval, or marked as spam. */
export type CommentStatusEnum =
  /** Comments with the Approved status */
  | 'APPROVE'
  /** Comments with the Unapproved status */
  | 'HOLD'
  /** Comments with the Spam status */
  | 'SPAM'
  /** Comments with the Trash status */
  | 'TRASH';

/** Sorting attributes for comment collections. Specifies which comment property determines the order of results. */
export type CommentsConnectionOrderbyEnum =
  /** Order by browser user agent of the commenter. */
  | 'COMMENT_AGENT'
  /** Order by approval status of the comment. */
  | 'COMMENT_APPROVED'
  /** Order by name of the comment author. */
  | 'COMMENT_AUTHOR'
  /** Order by e-mail of the comment author. */
  | 'COMMENT_AUTHOR_EMAIL'
  /** Order by IP address of the comment author. */
  | 'COMMENT_AUTHOR_IP'
  /** Order by URL address of the comment author. */
  | 'COMMENT_AUTHOR_URL'
  /** Order by the comment contents. */
  | 'COMMENT_CONTENT'
  /** Chronological ordering by comment submission date. */
  | 'COMMENT_DATE'
  /** Chronological ordering by comment date in UTC/GMT time. */
  | 'COMMENT_DATE_GMT'
  /** Ordering by internal ID (typically reflects creation order). */
  | 'COMMENT_ID'
  /** Preserve custom order of IDs as specified in the query. */
  | 'COMMENT_IN'
  /** Order by the comment karma score. */
  | 'COMMENT_KARMA'
  /** Ordering by parent comment relationship (threaded discussions). */
  | 'COMMENT_PARENT'
  /** Ordering by associated content item ID. */
  | 'COMMENT_POST_ID'
  /** Ordering by comment classification (standard comments, pingbacks, etc.). */
  | 'COMMENT_TYPE'
  /** Ordering by the user account ID associated with the comment as the comment author. */
  | 'USER_ID';

/** Enum of all available language codes */
export type LanguageCodeEnum =
  | 'DE'
  | 'EN';

/** Filter item by specific language, default language or list all languages */
export type LanguageCodeFilterEnum =
  | 'ALL'
  | 'DE'
  | 'DEFAULT'
  | 'EN';

/** Designated areas where navigation menus can be displayed. Represents the named regions in the interface where menus can be assigned. */
export type MenuLocationEnum =
  /** Put the menu in the primary-menu location */
  | 'PRIMARY_MENU'
  /** Put the menu in the primary-menu___en location */
  | 'PRIMARY_MENU___EN'
  /** Put the menu in the secondary-menu location */
  | 'SECONDARY_MENU'
  /** Put the menu in the secondary-menu___en location */
  | 'SECONDARY_MENU___EN';

/** Sort direction for ordered results. Determines whether items are returned in ascending or descending order. */
export type OrderEnum =
  /** Results ordered from lowest to highest values (i.e. A-Z, oldest-newest) */
  | 'ASC'
  /** Results ordered from highest to lowest values (i.e. Z-A, newest-oldest) */
  | 'DESC';

/** Content sorting attributes for post-type objects. Identifies which content property should be used to determine result order. */
export type PostObjectsConnectionOrderbyEnum =
  /** Ordering by content author (typically by author name). */
  | 'AUTHOR'
  /** Ordering by popularity based on number of comments. */
  | 'COMMENT_COUNT'
  /** Chronological ordering by publication date. */
  | 'DATE'
  /** Maintain custom order of IDs exactly as specified in the query with the IN field. */
  | 'IN'
  /** Ordering by manually defined sort position. */
  | 'MENU_ORDER'
  /** Chronological ordering by modified date. */
  | 'MODIFIED'
  /** Maintain custom order of IDs exactly as specified in the query with the NAME_IN field. */
  | 'NAME_IN'
  /** Ordering by parent-child relationship in hierarchical content. */
  | 'PARENT'
  /** Alphabetical ordering by URL-friendly name. */
  | 'SLUG'
  /** Alphabetical ordering by content title */
  | 'TITLE';

/** Publishing status that controls the visibility and editorial state of content. Determines whether content is published, pending review, in draft state, or private. */
export type PostStatusEnum =
  /** Objects with the acf-disabled status */
  | 'ACF_DISABLED'
  /** Automatically saved content that has not been manually saved */
  | 'AUTO_DRAFT'
  /** Objects with the dp-rewrite-republish status */
  | 'DP_REWRITE_REPUBLISH'
  /** Content that is saved but not yet published or visible to the public */
  | 'DRAFT'
  /** Objects with the future status */
  | 'FUTURE'
  /** Content that inherits its status from a parent object */
  | 'INHERIT'
  /** Content awaiting review before publication */
  | 'PENDING'
  /** Content only visible to authorized users with appropriate permissions */
  | 'PRIVATE'
  /** Content that is publicly visible to all visitors */
  | 'PUBLISH'
  /** Objects with the request-completed status */
  | 'REQUEST_COMPLETED'
  /** Objects with the request-confirmed status */
  | 'REQUEST_CONFIRMED'
  /** Objects with the request-failed status */
  | 'REQUEST_FAILED'
  /** Objects with the request-pending status */
  | 'REQUEST_PENDING'
  /** Content marked for deletion but still recoverable */
  | 'TRASH';

/** Sorting attributes for taxonomy term collections. Determines which property of taxonomy terms is used for ordering results. */
export type TermObjectsConnectionOrderbyEnum =
  /** Ordering by number of associated content items. */
  | 'COUNT'
  /** Alphabetical ordering by term description text. */
  | 'DESCRIPTION'
  /** Alphabetical ordering by term name. */
  | 'NAME'
  /** Alphabetical ordering by URL-friendly name. */
  | 'SLUG'
  /** Ordering by assigned term grouping value. */
  | 'TERM_GROUP'
  /** Ordering by internal identifier. */
  | 'TERM_ID'
  /** Ordering by manually defined sort position. */
  | 'TERM_ORDER';

/** Identifier types for retrieving a specific user. Determines whether to look up users by ID, email, username, or other unique properties. */
export type UserNodeIdTypeEnum =
  /** The Database ID for the node */
  | 'DATABASE_ID'
  /** The Email of the User */
  | 'EMAIL'
  /** The hashed Global ID */
  | 'ID'
  /** The slug of the User */
  | 'SLUG'
  /** The URI for the node */
  | 'URI'
  /** The username the User uses to login with */
  | 'USERNAME';

export type CoreParagraphFragment = { name: string | null, attributes: { content: string | null, align: string | null } | null } & { ' $fragmentName'?: 'CoreParagraphFragment' };

export type CoreListFragment = { name: string | null, innerBlocks: Array<
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null, attributes: { content: string | null } | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
    | { name: string | null }
   | null> | null } & { ' $fragmentName'?: 'CoreListFragment' };

export type CoreHeadingFragment = { name: string | null, attributes: { align: string | null, content: string | null, level: number, textAlign: string | null } | null } & { ' $fragmentName'?: 'CoreHeadingFragment' };

export type CoreCodeFragment = { name: string | null, attributes: { content: string | null, align: string | null, className: string | null } | null } & { ' $fragmentName'?: 'CoreCodeFragment' };

export type CoreImageFragment = { name: string | null, attributes: { align: string | null, alt: string, aspectRatio: string | null, caption: string | null, height: string | null, id: number | null, sizeSlug: string | null, src: string | null, title: string | null, width: string | null } | null, mediaDetails: { height: number | null, width: number | null, sizes: Array<{ sourceUrl: string | null, file: string | null, fileSize: number | null, height: string | null, mimeType: string | null, name: string | null, width: string | null } | null> | null } | null } & { ' $fragmentName'?: 'CoreImageFragment' };

export type CoreButtonFragment = { name: string | null, attributes: { text: string | null, type: string, url: string | null, textAlign: string | null, title: string | null, linkTarget: string | null, rel: string | null } | null } & { ' $fragmentName'?: 'CoreButtonFragment' };

export type CoreButtonsFragment = { name: string | null, attributes: { align: string | null } | null, innerBlocks: Array<
    | { ' $fragmentRefs'?: { 'CoreButtonFragment': CoreButtonFragment } }
    | Record<PropertyKey, never>
   | null> | null } & { ' $fragmentName'?: 'CoreButtonsFragment' };

export type AcfGithubRawDataFragment = { name: string | null, githubRawData: { codeLanguage: string | null, githubRawUrl: string | null } | null } & { ' $fragmentName'?: 'AcfGithubRawDataFragment' };

export type AcfCodeHighlightingFragment = { name: string | null, attributes: { data: unknown } | null } & { ' $fragmentName'?: 'AcfCodeHighlightingFragment' };

export type CoreDetailsFragment = { name: string | null, attributes: { summary: string | null, showContent: boolean } | null, innerBlocks: Array<
    | { ' $fragmentRefs'?: { 'AllBlocks_AcfCodeHighlighting_Fragment': AllBlocks_AcfCodeHighlighting_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_AcfGithubRawData_Fragment': AllBlocks_AcfGithubRawData_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreAccordion_Fragment': AllBlocks_CoreAccordion_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreAccordionHeading_Fragment': AllBlocks_CoreAccordionHeading_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreAccordionItem_Fragment': AllBlocks_CoreAccordionItem_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreAccordionPanel_Fragment': AllBlocks_CoreAccordionPanel_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreArchives_Fragment': AllBlocks_CoreArchives_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreAudio_Fragment': AllBlocks_CoreAudio_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreAvatar_Fragment': AllBlocks_CoreAvatar_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreBlock_Fragment': AllBlocks_CoreBlock_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreButton_Fragment': AllBlocks_CoreButton_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreButtons_Fragment': AllBlocks_CoreButtons_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCalendar_Fragment': AllBlocks_CoreCalendar_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCategories_Fragment': AllBlocks_CoreCategories_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCode_Fragment': AllBlocks_CoreCode_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreColumn_Fragment': AllBlocks_CoreColumn_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreColumns_Fragment': AllBlocks_CoreColumns_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentAuthorName_Fragment': AllBlocks_CoreCommentAuthorName_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentContent_Fragment': AllBlocks_CoreCommentContent_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentDate_Fragment': AllBlocks_CoreCommentDate_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentEditLink_Fragment': AllBlocks_CoreCommentEditLink_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentReplyLink_Fragment': AllBlocks_CoreCommentReplyLink_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentTemplate_Fragment': AllBlocks_CoreCommentTemplate_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreComments_Fragment': AllBlocks_CoreComments_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentsPagination_Fragment': AllBlocks_CoreCommentsPagination_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentsPaginationNext_Fragment': AllBlocks_CoreCommentsPaginationNext_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentsPaginationNumbers_Fragment': AllBlocks_CoreCommentsPaginationNumbers_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentsPaginationPrevious_Fragment': AllBlocks_CoreCommentsPaginationPrevious_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentsTitle_Fragment': AllBlocks_CoreCommentsTitle_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreCover_Fragment': AllBlocks_CoreCover_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreDetails_Fragment': AllBlocks_CoreDetails_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreEmbed_Fragment': AllBlocks_CoreEmbed_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreFile_Fragment': AllBlocks_CoreFile_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreFootnotes_Fragment': AllBlocks_CoreFootnotes_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreFreeform_Fragment': AllBlocks_CoreFreeform_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreGallery_Fragment': AllBlocks_CoreGallery_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreGroup_Fragment': AllBlocks_CoreGroup_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreHeading_Fragment': AllBlocks_CoreHeading_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreHomeLink_Fragment': AllBlocks_CoreHomeLink_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreHtml_Fragment': AllBlocks_CoreHtml_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreImage_Fragment': AllBlocks_CoreImage_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreLatestComments_Fragment': AllBlocks_CoreLatestComments_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreLatestPosts_Fragment': AllBlocks_CoreLatestPosts_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreLegacyWidget_Fragment': AllBlocks_CoreLegacyWidget_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreList_Fragment': AllBlocks_CoreList_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreListItem_Fragment': AllBlocks_CoreListItem_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreLoginout_Fragment': AllBlocks_CoreLoginout_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreMath_Fragment': AllBlocks_CoreMath_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreMediaText_Fragment': AllBlocks_CoreMediaText_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreMissing_Fragment': AllBlocks_CoreMissing_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreMore_Fragment': AllBlocks_CoreMore_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreNavigation_Fragment': AllBlocks_CoreNavigation_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreNavigationLink_Fragment': AllBlocks_CoreNavigationLink_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreNavigationSubmenu_Fragment': AllBlocks_CoreNavigationSubmenu_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreNextpage_Fragment': AllBlocks_CoreNextpage_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePageList_Fragment': AllBlocks_CorePageList_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePageListItem_Fragment': AllBlocks_CorePageListItem_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreParagraph_Fragment': AllBlocks_CoreParagraph_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePattern_Fragment': AllBlocks_CorePattern_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostAuthor_Fragment': AllBlocks_CorePostAuthor_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostAuthorBiography_Fragment': AllBlocks_CorePostAuthorBiography_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostAuthorName_Fragment': AllBlocks_CorePostAuthorName_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostComments_Fragment': AllBlocks_CorePostComments_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostCommentsCount_Fragment': AllBlocks_CorePostCommentsCount_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostCommentsForm_Fragment': AllBlocks_CorePostCommentsForm_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostCommentsLink_Fragment': AllBlocks_CorePostCommentsLink_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostContent_Fragment': AllBlocks_CorePostContent_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostDate_Fragment': AllBlocks_CorePostDate_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostExcerpt_Fragment': AllBlocks_CorePostExcerpt_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostFeaturedImage_Fragment': AllBlocks_CorePostFeaturedImage_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostNavigationLink_Fragment': AllBlocks_CorePostNavigationLink_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostTemplate_Fragment': AllBlocks_CorePostTemplate_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostTerms_Fragment': AllBlocks_CorePostTerms_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostTimeToRead_Fragment': AllBlocks_CorePostTimeToRead_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePostTitle_Fragment': AllBlocks_CorePostTitle_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePreformatted_Fragment': AllBlocks_CorePreformatted_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CorePullquote_Fragment': AllBlocks_CorePullquote_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreQuery_Fragment': AllBlocks_CoreQuery_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryNoResults_Fragment': AllBlocks_CoreQueryNoResults_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryPagination_Fragment': AllBlocks_CoreQueryPagination_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryPaginationNext_Fragment': AllBlocks_CoreQueryPaginationNext_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryPaginationNumbers_Fragment': AllBlocks_CoreQueryPaginationNumbers_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryPaginationPrevious_Fragment': AllBlocks_CoreQueryPaginationPrevious_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryTitle_Fragment': AllBlocks_CoreQueryTitle_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryTotal_Fragment': AllBlocks_CoreQueryTotal_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreQuote_Fragment': AllBlocks_CoreQuote_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreReadMore_Fragment': AllBlocks_CoreReadMore_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreRss_Fragment': AllBlocks_CoreRss_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreSearch_Fragment': AllBlocks_CoreSearch_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreSeparator_Fragment': AllBlocks_CoreSeparator_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreShortcode_Fragment': AllBlocks_CoreShortcode_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreSiteLogo_Fragment': AllBlocks_CoreSiteLogo_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreSiteTagline_Fragment': AllBlocks_CoreSiteTagline_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreSiteTitle_Fragment': AllBlocks_CoreSiteTitle_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreSocialLink_Fragment': AllBlocks_CoreSocialLink_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreSocialLinks_Fragment': AllBlocks_CoreSocialLinks_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreSpacer_Fragment': AllBlocks_CoreSpacer_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreTable_Fragment': AllBlocks_CoreTable_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreTagCloud_Fragment': AllBlocks_CoreTagCloud_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreTemplatePart_Fragment': AllBlocks_CoreTemplatePart_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreTermCount_Fragment': AllBlocks_CoreTermCount_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreTermDescription_Fragment': AllBlocks_CoreTermDescription_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreTermName_Fragment': AllBlocks_CoreTermName_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreTermTemplate_Fragment': AllBlocks_CoreTermTemplate_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreTermsQuery_Fragment': AllBlocks_CoreTermsQuery_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreTextColumns_Fragment': AllBlocks_CoreTextColumns_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreVerse_Fragment': AllBlocks_CoreVerse_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreVideo_Fragment': AllBlocks_CoreVideo_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_CoreWidgetGroup_Fragment': AllBlocks_CoreWidgetGroup_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_PolylangLanguageSwitcher_Fragment': AllBlocks_PolylangLanguageSwitcher_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_PolylangNavigationLanguageSwitcher_Fragment': AllBlocks_PolylangNavigationLanguageSwitcher_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_SafeSvgSvgIcon_Fragment': AllBlocks_SafeSvgSvgIcon_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_YoastFaqBlock_Fragment': AllBlocks_YoastFaqBlock_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_YoastHowToBlock_Fragment': AllBlocks_YoastHowToBlock_Fragment } }
    | { ' $fragmentRefs'?: { 'AllBlocks_YoastSeoBreadcrumbs_Fragment': AllBlocks_YoastSeoBreadcrumbs_Fragment } }
   | null> | null } & { ' $fragmentName'?: 'CoreDetailsFragment' };

type AllBlocks_AcfCodeHighlighting_Fragment = { ' $fragmentRefs'?: { 'AcfCodeHighlightingFragment': AcfCodeHighlightingFragment } } & { ' $fragmentName'?: 'AllBlocks_AcfCodeHighlighting_Fragment' };

type AllBlocks_AcfGithubRawData_Fragment = { ' $fragmentRefs'?: { 'AcfGithubRawDataFragment': AcfGithubRawDataFragment } } & { ' $fragmentName'?: 'AllBlocks_AcfGithubRawData_Fragment' };

type AllBlocks_CoreButton_Fragment = { ' $fragmentRefs'?: { 'CoreButtonFragment': CoreButtonFragment } } & { ' $fragmentName'?: 'AllBlocks_CoreButton_Fragment' };

type AllBlocks_CoreButtons_Fragment = { ' $fragmentRefs'?: { 'CoreButtonsFragment': CoreButtonsFragment } } & { ' $fragmentName'?: 'AllBlocks_CoreButtons_Fragment' };

type AllBlocks_CoreCode_Fragment = { ' $fragmentRefs'?: { 'CoreCodeFragment': CoreCodeFragment } } & { ' $fragmentName'?: 'AllBlocks_CoreCode_Fragment' };

type AllBlocks_CoreHeading_Fragment = { ' $fragmentRefs'?: { 'CoreHeadingFragment': CoreHeadingFragment } } & { ' $fragmentName'?: 'AllBlocks_CoreHeading_Fragment' };

type AllBlocks_CoreImage_Fragment = { ' $fragmentRefs'?: { 'CoreImageFragment': CoreImageFragment } } & { ' $fragmentName'?: 'AllBlocks_CoreImage_Fragment' };

type AllBlocks_CoreList_Fragment = { ' $fragmentRefs'?: { 'CoreListFragment': CoreListFragment } } & { ' $fragmentName'?: 'AllBlocks_CoreList_Fragment' };

type AllBlocks_CoreParagraph_Fragment = { ' $fragmentRefs'?: { 'CoreParagraphFragment': CoreParagraphFragment } } & { ' $fragmentName'?: 'AllBlocks_CoreParagraph_Fragment' };

export type AllBlocksFragment =
  | AllBlocks_AcfCodeHighlighting_Fragment
  | AllBlocks_AcfGithubRawData_Fragment
  | AllBlocks_CoreButton_Fragment
  | AllBlocks_CoreButtons_Fragment
  | AllBlocks_CoreCode_Fragment
  | AllBlocks_CoreHeading_Fragment
  | AllBlocks_CoreImage_Fragment
  | AllBlocks_CoreList_Fragment
  | AllBlocks_CoreParagraph_Fragment
;

export type PostTypeSeoFragmentFragment = { title: string | null, canonical: string | null, metaDesc: string | null, metaRobotsNofollow: string | null, metaRobotsNoindex: string | null, opengraphSiteName: string | null, opengraphAuthor: string | null, opengraphDescription: string | null, opengraphPublisher: string | null, opengraphTitle: string | null, opengraphType: string | null, opengraphUrl: string | null, opengraphPublishedTime: string | null, opengraphModifiedTime: string | null, twitterDescription: string | null, twitterTitle: string | null, opengraphImage: { sourceUrl: string | null } | null } & { ' $fragmentName'?: 'PostTypeSeoFragmentFragment' };

export type CommentDetailsFragment = { content: string | null, dateGmt: string | null, id: string, parentId: string | null, commentId: number | null, author: { node:
      | { name: string | null, id: string, avatar: { foundAvatar: boolean | null, default: string | null, height: number | null, width: number | null, url: string | null } | null }
      | { name: string | null, id: string, avatar: { foundAvatar: boolean | null, default: string | null, height: number | null, width: number | null, url: string | null } | null }
     } | null } & { ' $fragmentName'?: 'CommentDetailsFragment' };

export type CreateCommentMutationVariables = Exact<{
  author?: string | null | undefined;
  authorEmail?: string | null | undefined;
  content?: string | null | undefined;
  parent?: string | number | null | undefined;
  commentOn?: number | null | undefined;
}>;


export type CreateCommentMutation = { createComment: { success: boolean | null, comment: { id: string, content: string | null, status: CommentStatusEnum | null, isRestricted: boolean | null, author: { node:
          | { name: string | null, email: string | null }
          | { name: string | null, email: string | null }
         } | null } | null } | null };

export type GetAuthorQueryVariables = Exact<{
  id?: string | number | null | undefined;
  idType?: UserNodeIdTypeEnum | null | undefined;
}>;


export type GetAuthorQuery = { user: { seo: { social: { facebook: string | null, instagram: string | null, linkedIn: string | null, mySpace: string | null, pinterest: string | null, soundCloud: string | null, twitter: string | null, wikipedia: string | null, youTube: string | null } | null } | null, socialAdvanced: { github: string | null, mastodon: string | null } | null } | null };

export type CategoryFieldsFragment = { count: number | null, name: string | null, slug: string | null, language: { code: LanguageCodeEnum | null, slug: string | null, locale: string | null } | null } & { ' $fragmentName'?: 'CategoryFieldsFragment' };

export type GetAllCategoriesQueryVariables = Exact<{
  first?: number | null | undefined;
  exclude?: Array<string | number | null | undefined> | string | number | null | undefined;
  hideEmpty?: boolean | null | undefined;
  languages?: Array<LanguageCodeEnum> | LanguageCodeEnum | null | undefined;
  orderby?: TermObjectsConnectionOrderbyEnum | null | undefined;
}>;


export type GetAllCategoriesQuery = { categories: { nodes: Array<(
      { children: { nodes: Array<(
          { children: { nodes: Array<{ ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }> } | null }
          & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
        )> } | null }
      & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
    )> } | null };

export type CommentFieldsFragment = { content: string | null, dateGmt: string | null, id: string, parentId: string | null, parentDatabaseId: number | null, author: { node:
      | { name: string | null, id: string, avatar: { foundAvatar: boolean | null, height: number | null, width: number | null, url: string | null } | null }
      | { name: string | null, id: string, avatar: { foundAvatar: boolean | null, height: number | null, width: number | null, url: string | null } | null }
     } | null } & { ' $fragmentName'?: 'CommentFieldsFragment' };

export type GetCommentsByIdQueryVariables = Exact<{
  contentId?: string | number | null | undefined;
  contentStatus?: Array<PostStatusEnum | null | undefined> | PostStatusEnum | null | undefined;
  orderby?: CommentsConnectionOrderbyEnum | null | undefined;
  first?: number | null | undefined;
  after?: string | null | undefined;
}>;


export type GetCommentsByIdQuery = { comments: { pageInfo: { hasNextPage: boolean, endCursor: string | null }, edges: Array<{ cursor: string | null, node: (
        { replies: { nodes: Array<(
            { replies: { nodes: Array<{ ' $fragmentRefs'?: { 'CommentFieldsFragment': CommentFieldsFragment } }> } | null }
            & { ' $fragmentRefs'?: { 'CommentFieldsFragment': CommentFieldsFragment } }
          )> } | null }
        & { ' $fragmentRefs'?: { 'CommentFieldsFragment': CommentFieldsFragment } }
      ) }> } | null };

export type GetMenuItemsQueryVariables = Exact<{
  language?: LanguageCodeFilterEnum | null | undefined;
  location?: MenuLocationEnum | null | undefined;
}>;


export type GetMenuItemsQuery = { menuItems: { nodes: Array<{ label: string | null, order: number | null, path: string | null, childItems: { nodes: Array<{ label: string | null, order: number | null, path: string | null }> } | null }> } | null };

export type GetMenuByIdQueryVariables = Exact<{
  id?: string | number | null | undefined;
}>;


export type GetMenuByIdQuery = { menu: { menuItems: { nodes: Array<{ label: string | null, order: number | null, path: string | null, childItems: { nodes: Array<{ label: string | null, order: number | null, path: string | null }> } | null }> } | null } | null };

export type PageFieldFragmentFragment = { slug: string | null, title: string | null, content: string | null, language: { code: LanguageCodeEnum | null, locale: string | null, name: string | null, slug: string | null } | null, seo: { ' $fragmentRefs'?: { 'PostTypeSeoFragmentFragment': PostTypeSeoFragmentFragment } } | null } & { ' $fragmentName'?: 'PageFieldFragmentFragment' };

export type GetPagesBySlugsQueryVariables = Exact<{
  slugs?: Array<string | null | undefined> | string | null | undefined;
}>;


export type GetPagesBySlugsQuery = { pages: { nodes: Array<(
      { translations: Array<{ ' $fragmentRefs'?: { 'PageFieldFragmentFragment': PageFieldFragmentFragment } } | null> | null }
      & { ' $fragmentRefs'?: { 'PageFieldFragmentFragment': PageFieldFragmentFragment } }
    )> } | null };

export type GetAllPostsQueryVariables = Exact<{
  first?: number | null | undefined;
  languages?: Array<LanguageCodeEnum> | LanguageCodeEnum | null | undefined;
  stati?: Array<PostStatusEnum | null | undefined> | PostStatusEnum | null | undefined;
  size?: number | null | undefined;
}>;


export type GetAllPostsQuery = { posts: { nodes: Array<{ title: string | null, slug: string | null, excerpt: string | null, dateGmt: string | null, modifiedGmt: string | null, content: string | null, postId: number, id: string, commentCount: number | null, commentStatus: string | null, editorBlocks: Array<
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_AcfCodeHighlighting_Fragment': AllBlocks_AcfCodeHighlighting_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_AcfGithubRawData_Fragment': AllBlocks_AcfGithubRawData_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreAccordion_Fragment': AllBlocks_CoreAccordion_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreAccordionHeading_Fragment': AllBlocks_CoreAccordionHeading_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreAccordionItem_Fragment': AllBlocks_CoreAccordionItem_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreAccordionPanel_Fragment': AllBlocks_CoreAccordionPanel_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreArchives_Fragment': AllBlocks_CoreArchives_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreAudio_Fragment': AllBlocks_CoreAudio_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreAvatar_Fragment': AllBlocks_CoreAvatar_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreBlock_Fragment': AllBlocks_CoreBlock_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreButton_Fragment': AllBlocks_CoreButton_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreButtons_Fragment': AllBlocks_CoreButtons_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCalendar_Fragment': AllBlocks_CoreCalendar_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCategories_Fragment': AllBlocks_CoreCategories_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCode_Fragment': AllBlocks_CoreCode_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreColumn_Fragment': AllBlocks_CoreColumn_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreColumns_Fragment': AllBlocks_CoreColumns_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentAuthorName_Fragment': AllBlocks_CoreCommentAuthorName_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentContent_Fragment': AllBlocks_CoreCommentContent_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentDate_Fragment': AllBlocks_CoreCommentDate_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentEditLink_Fragment': AllBlocks_CoreCommentEditLink_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentReplyLink_Fragment': AllBlocks_CoreCommentReplyLink_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentTemplate_Fragment': AllBlocks_CoreCommentTemplate_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreComments_Fragment': AllBlocks_CoreComments_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentsPagination_Fragment': AllBlocks_CoreCommentsPagination_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentsPaginationNext_Fragment': AllBlocks_CoreCommentsPaginationNext_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentsPaginationNumbers_Fragment': AllBlocks_CoreCommentsPaginationNumbers_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentsPaginationPrevious_Fragment': AllBlocks_CoreCommentsPaginationPrevious_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCommentsTitle_Fragment': AllBlocks_CoreCommentsTitle_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreCover_Fragment': AllBlocks_CoreCover_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'CoreDetailsFragment': CoreDetailsFragment;'AllBlocks_CoreDetails_Fragment': AllBlocks_CoreDetails_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreEmbed_Fragment': AllBlocks_CoreEmbed_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreFile_Fragment': AllBlocks_CoreFile_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreFootnotes_Fragment': AllBlocks_CoreFootnotes_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreFreeform_Fragment': AllBlocks_CoreFreeform_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreGallery_Fragment': AllBlocks_CoreGallery_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreGroup_Fragment': AllBlocks_CoreGroup_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreHeading_Fragment': AllBlocks_CoreHeading_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreHomeLink_Fragment': AllBlocks_CoreHomeLink_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreHtml_Fragment': AllBlocks_CoreHtml_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreImage_Fragment': AllBlocks_CoreImage_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreLatestComments_Fragment': AllBlocks_CoreLatestComments_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreLatestPosts_Fragment': AllBlocks_CoreLatestPosts_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreLegacyWidget_Fragment': AllBlocks_CoreLegacyWidget_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreList_Fragment': AllBlocks_CoreList_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreListItem_Fragment': AllBlocks_CoreListItem_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreLoginout_Fragment': AllBlocks_CoreLoginout_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreMath_Fragment': AllBlocks_CoreMath_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreMediaText_Fragment': AllBlocks_CoreMediaText_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreMissing_Fragment': AllBlocks_CoreMissing_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreMore_Fragment': AllBlocks_CoreMore_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreNavigation_Fragment': AllBlocks_CoreNavigation_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreNavigationLink_Fragment': AllBlocks_CoreNavigationLink_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreNavigationSubmenu_Fragment': AllBlocks_CoreNavigationSubmenu_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreNextpage_Fragment': AllBlocks_CoreNextpage_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePageList_Fragment': AllBlocks_CorePageList_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePageListItem_Fragment': AllBlocks_CorePageListItem_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreParagraph_Fragment': AllBlocks_CoreParagraph_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePattern_Fragment': AllBlocks_CorePattern_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostAuthor_Fragment': AllBlocks_CorePostAuthor_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostAuthorBiography_Fragment': AllBlocks_CorePostAuthorBiography_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostAuthorName_Fragment': AllBlocks_CorePostAuthorName_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostComments_Fragment': AllBlocks_CorePostComments_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostCommentsCount_Fragment': AllBlocks_CorePostCommentsCount_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostCommentsForm_Fragment': AllBlocks_CorePostCommentsForm_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostCommentsLink_Fragment': AllBlocks_CorePostCommentsLink_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostContent_Fragment': AllBlocks_CorePostContent_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostDate_Fragment': AllBlocks_CorePostDate_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostExcerpt_Fragment': AllBlocks_CorePostExcerpt_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostFeaturedImage_Fragment': AllBlocks_CorePostFeaturedImage_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostNavigationLink_Fragment': AllBlocks_CorePostNavigationLink_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostTemplate_Fragment': AllBlocks_CorePostTemplate_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostTerms_Fragment': AllBlocks_CorePostTerms_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostTimeToRead_Fragment': AllBlocks_CorePostTimeToRead_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePostTitle_Fragment': AllBlocks_CorePostTitle_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePreformatted_Fragment': AllBlocks_CorePreformatted_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CorePullquote_Fragment': AllBlocks_CorePullquote_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreQuery_Fragment': AllBlocks_CoreQuery_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryNoResults_Fragment': AllBlocks_CoreQueryNoResults_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryPagination_Fragment': AllBlocks_CoreQueryPagination_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryPaginationNext_Fragment': AllBlocks_CoreQueryPaginationNext_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryPaginationNumbers_Fragment': AllBlocks_CoreQueryPaginationNumbers_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryPaginationPrevious_Fragment': AllBlocks_CoreQueryPaginationPrevious_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryTitle_Fragment': AllBlocks_CoreQueryTitle_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreQueryTotal_Fragment': AllBlocks_CoreQueryTotal_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreQuote_Fragment': AllBlocks_CoreQuote_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreReadMore_Fragment': AllBlocks_CoreReadMore_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreRss_Fragment': AllBlocks_CoreRss_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreSearch_Fragment': AllBlocks_CoreSearch_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreSeparator_Fragment': AllBlocks_CoreSeparator_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreShortcode_Fragment': AllBlocks_CoreShortcode_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreSiteLogo_Fragment': AllBlocks_CoreSiteLogo_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreSiteTagline_Fragment': AllBlocks_CoreSiteTagline_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreSiteTitle_Fragment': AllBlocks_CoreSiteTitle_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreSocialLink_Fragment': AllBlocks_CoreSocialLink_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreSocialLinks_Fragment': AllBlocks_CoreSocialLinks_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreSpacer_Fragment': AllBlocks_CoreSpacer_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreTable_Fragment': AllBlocks_CoreTable_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreTagCloud_Fragment': AllBlocks_CoreTagCloud_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreTemplatePart_Fragment': AllBlocks_CoreTemplatePart_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreTermCount_Fragment': AllBlocks_CoreTermCount_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreTermDescription_Fragment': AllBlocks_CoreTermDescription_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreTermName_Fragment': AllBlocks_CoreTermName_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreTermTemplate_Fragment': AllBlocks_CoreTermTemplate_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreTermsQuery_Fragment': AllBlocks_CoreTermsQuery_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreTextColumns_Fragment': AllBlocks_CoreTextColumns_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreVerse_Fragment': AllBlocks_CoreVerse_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreVideo_Fragment': AllBlocks_CoreVideo_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_CoreWidgetGroup_Fragment': AllBlocks_CoreWidgetGroup_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_PolylangLanguageSwitcher_Fragment': AllBlocks_PolylangLanguageSwitcher_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_PolylangNavigationLanguageSwitcher_Fragment': AllBlocks_PolylangNavigationLanguageSwitcher_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_SafeSvgSvgIcon_Fragment': AllBlocks_SafeSvgSvgIcon_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_YoastFaqBlock_Fragment': AllBlocks_YoastFaqBlock_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_YoastHowToBlock_Fragment': AllBlocks_YoastHowToBlock_Fragment } }
        )
        | (
          { apiVersion: number | null, blockEditorCategoryName: string | null, clientId: string | null, name: string | null, parentClientId: string | null, type: string | null }
          & { ' $fragmentRefs'?: { 'AllBlocks_YoastSeoBreadcrumbs_Fragment': AllBlocks_YoastSeoBreadcrumbs_Fragment } }
        )
       | null> | null, author: { node: { email: string | null, firstName: string | null, lastName: string | null, description: string | null, id: string, avatar: { foundAvatar: boolean | null, height: number | null, url: string | null, width: number | null } | null, seo: { social: { facebook: string | null, instagram: string | null, linkedIn: string | null, mySpace: string | null, pinterest: string | null, soundCloud: string | null, twitter: string | null, wikipedia: string | null, youTube: string | null } | null } | null, socialAdvanced: { github: string | null, mastodon: string | null } | null } } | null, featuredImage: { node: { altText: string | null, mediaItemUrl: string | null, srcSet: string | null, sizes: string | null, mimeType: string | null, mediaDetails: { height: number | null, width: number | null, sizes: Array<{ width: string | null, sourceUrl: string | null, mimeType: string | null } | null> | null } | null } } | null, categories: { edges: Array<{ node: { name: string | null, slug: string | null, parent: { node: { name: string | null, slug: string | null } } | null, children: { edges: Array<{ node: { name: string | null, slug: string | null } }> } | null } }> } | null, comments: { nodes: Array<(
          { replies: { nodes: Array<(
              { replies: { nodes: Array<(
                  { replies: { nodes: Array<(
                      { replies: { nodes: Array<(
                          { replies: { nodes: Array<{ ' $fragmentRefs'?: { 'CommentDetailsFragment': CommentDetailsFragment } }> } | null }
                          & { ' $fragmentRefs'?: { 'CommentDetailsFragment': CommentDetailsFragment } }
                        )> } | null }
                      & { ' $fragmentRefs'?: { 'CommentDetailsFragment': CommentDetailsFragment } }
                    )> } | null }
                  & { ' $fragmentRefs'?: { 'CommentDetailsFragment': CommentDetailsFragment } }
                )> } | null }
              & { ' $fragmentRefs'?: { 'CommentDetailsFragment': CommentDetailsFragment } }
            )> } | null }
          & { ' $fragmentRefs'?: { 'CommentDetailsFragment': CommentDetailsFragment } }
        )> } | null, language: { code: LanguageCodeEnum | null, locale: string | null, name: string | null, slug: string | null } | null, seo: { title: string | null, readingTime: number | null, canonical: string | null, metaDesc: string | null, metaRobotsNofollow: string | null, metaRobotsNoindex: string | null, opengraphSiteName: string | null, opengraphAuthor: string | null, opengraphDescription: string | null, opengraphPublisher: string | null, opengraphTitle: string | null, opengraphType: string | null, opengraphUrl: string | null, opengraphPublishedTime: string | null, opengraphModifiedTime: string | null, twitterDescription: string | null, twitterTitle: string | null, opengraphImage: { sourceUrl: string | null } | null } | null, translations: Array<{ slug: string | null, language: { slug: string | null, name: string | null } | null } | null> | null }> } | null };

export type GetPostsPreviewQueryVariables = Exact<{
  first?: number | null | undefined;
  languages?: Array<LanguageCodeEnum> | LanguageCodeEnum | null | undefined;
  stati?: Array<PostStatusEnum | null | undefined> | PostStatusEnum | null | undefined;
  field?: PostObjectsConnectionOrderbyEnum | null | undefined;
  order?: OrderEnum | null | undefined;
}>;


export type GetPostsPreviewQuery = { posts: { nodes: Array<{ dateGmt: string | null, modifiedGmt: string | null, slug: string | null, commentCount: number | null, excerpt: string | null, title: string | null, language: { code: LanguageCodeEnum | null, locale: string | null, name: string | null, slug: string | null } | null, translations: Array<{ slug: string | null, language: { code: LanguageCodeEnum | null, locale: string | null, name: string | null, slug: string | null } | null } | null> | null, featuredImage: { node: { altText: string | null, mediaItemUrl: string | null, srcSet: string | null, sizes: string | null, mediaDetails: { height: number | null, width: number | null } | null } } | null, seo: { readingTime: number | null } | null }> } | null };

export type GetAllPostPreviewsByCategoryQueryVariables = Exact<{
  exclude?: Array<string | number | null | undefined> | string | number | null | undefined;
  field?: PostObjectsConnectionOrderbyEnum | null | undefined;
  order?: OrderEnum | null | undefined;
  stati?: Array<PostStatusEnum | null | undefined> | PostStatusEnum | null | undefined;
}>;


export type GetAllPostPreviewsByCategoryQuery = { categories: { nodes: Array<{ count: number | null, name: string | null, slug: string | null, language: { code: LanguageCodeEnum | null, locale: string | null, name: string | null, slug: string | null } | null, children: { nodes: Array<{ count: number | null, name: string | null, slug: string | null, children: { nodes: Array<{ count: number | null, name: string | null, slug: string | null, id: string }> } | null }> } | null, posts: { nodes: Array<{ title: string | null, excerpt: string | null, slug: string | null, language: { code: LanguageCodeEnum | null, locale: string | null, name: string | null, slug: string | null } | null }> } | null, translations: Array<{ name: string | null, slug: string | null, posts: { nodes: Array<{ title: string | null, excerpt: string | null, slug: string | null, language: { code: LanguageCodeEnum | null, locale: string | null, name: string | null, slug: string | null } | null }> } | null, language: { slug: string | null } | null } | null> | null, seo: { title: string | null, canonical: string | null, metaDesc: string | null, metaRobotsNofollow: string | null, metaRobotsNoindex: string | null, opengraphSiteName: string | null, opengraphAuthor: string | null, opengraphDescription: string | null, opengraphPublisher: string | null, opengraphTitle: string | null, opengraphType: string | null, opengraphUrl: string | null, opengraphPublishedTime: string | null, opengraphModifiedTime: string | null, twitterDescription: string | null, twitterTitle: string | null, opengraphImage: { sourceUrl: string | null } | null } | null }> } | null };

export const CoreParagraphFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreParagraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreParagraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"align"}}]}}]}}]} as unknown as DocumentNode<CoreParagraphFragment, unknown>;
export const CoreListFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreList"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"innerBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreListItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CoreListFragment, unknown>;
export const CoreHeadingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreHeading"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreHeading"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"textAlign"}}]}}]}}]} as unknown as DocumentNode<CoreHeadingFragment, unknown>;
export const CoreCodeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreCode"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreCode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"className"}}]}}]}}]} as unknown as DocumentNode<CoreCodeFragment, unknown>;
export const CoreImageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"aspectRatio"}},{"kind":"Field","name":{"kind":"Name","value":"caption"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sizeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"src"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mediaDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sizes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"file"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}}]} as unknown as DocumentNode<CoreImageFragment, unknown>;
export const CoreButtonFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreButton"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"textAlign"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"linkTarget"}},{"kind":"Field","name":{"kind":"Name","value":"rel"}}]}}]}}]} as unknown as DocumentNode<CoreButtonFragment, unknown>;
export const CoreButtonsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreButtons"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreButtons"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}}]}},{"kind":"Field","name":{"kind":"Name","value":"innerBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreButton"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreButton"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"textAlign"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"linkTarget"}},{"kind":"Field","name":{"kind":"Name","value":"rel"}}]}}]}}]} as unknown as DocumentNode<CoreButtonsFragment, unknown>;
export const AcfGithubRawDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AcfGithubRawData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AcfGithubRawData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"githubRawData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"codeLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"githubRawUrl"}}]}}]}}]} as unknown as DocumentNode<AcfGithubRawDataFragment, unknown>;
export const AcfCodeHighlightingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AcfCodeHighlighting"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AcfCodeHighlighting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<AcfCodeHighlightingFragment, unknown>;
export const AllBlocksFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllBlocks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EditorBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreParagraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreList"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreHeading"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreCode"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreImage"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreButtons"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AcfGithubRawData"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AcfCodeHighlighting"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreButton"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"textAlign"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"linkTarget"}},{"kind":"Field","name":{"kind":"Name","value":"rel"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreParagraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreParagraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"align"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreList"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"innerBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreListItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreHeading"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreHeading"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"textAlign"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreCode"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreCode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"className"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"aspectRatio"}},{"kind":"Field","name":{"kind":"Name","value":"caption"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sizeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"src"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mediaDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sizes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"file"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreButtons"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreButtons"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}}]}},{"kind":"Field","name":{"kind":"Name","value":"innerBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreButton"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AcfGithubRawData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AcfGithubRawData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"githubRawData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"codeLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"githubRawUrl"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AcfCodeHighlighting"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AcfCodeHighlighting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<AllBlocksFragment, unknown>;
export const CoreDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"showContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"innerBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllBlocks"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreParagraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreParagraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"align"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreList"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"innerBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreListItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreHeading"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreHeading"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"textAlign"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreCode"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreCode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"className"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"aspectRatio"}},{"kind":"Field","name":{"kind":"Name","value":"caption"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sizeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"src"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mediaDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sizes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"file"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreButton"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"textAlign"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"linkTarget"}},{"kind":"Field","name":{"kind":"Name","value":"rel"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreButtons"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreButtons"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}}]}},{"kind":"Field","name":{"kind":"Name","value":"innerBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreButton"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AcfGithubRawData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AcfGithubRawData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"githubRawData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"codeLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"githubRawUrl"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AcfCodeHighlighting"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AcfCodeHighlighting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllBlocks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EditorBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreParagraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreList"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreHeading"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreCode"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreImage"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreButtons"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AcfGithubRawData"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AcfCodeHighlighting"}}]}}]} as unknown as DocumentNode<CoreDetailsFragment, unknown>;
export const CommentDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"dateGmt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"commentId"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"foundAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CommentDetailsFragment, unknown>;
export const CategoryFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}}]}}]} as unknown as DocumentNode<CategoryFieldsFragment, unknown>;
export const CommentFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"dateGmt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"parentDatabaseId"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"foundAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CommentFieldsFragment, unknown>;
export const PostTypeSeoFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostTypeSeoFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PostTypeSEO"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"canonical"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"metaRobotsNofollow"}},{"kind":"Field","name":{"kind":"Name","value":"metaRobotsNoindex"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphSiteName"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphDescription"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphPublisher"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphTitle"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphType"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphUrl"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphPublishedTime"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"twitterDescription"}},{"kind":"Field","name":{"kind":"Name","value":"twitterTitle"}}]}}]} as unknown as DocumentNode<PostTypeSeoFragmentFragment, unknown>;
export const PageFieldFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFieldFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostTypeSeoFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostTypeSeoFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PostTypeSEO"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"canonical"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"metaRobotsNofollow"}},{"kind":"Field","name":{"kind":"Name","value":"metaRobotsNoindex"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphSiteName"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphDescription"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphPublisher"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphTitle"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphType"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphUrl"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphPublishedTime"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"twitterDescription"}},{"kind":"Field","name":{"kind":"Name","value":"twitterTitle"}}]}}]} as unknown as DocumentNode<PageFieldFragmentFragment, unknown>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"author"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authorEmail"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"defaultValue":{"kind":"StringValue","value":"","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentOn"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"author"},"value":{"kind":"Variable","name":{"kind":"Name","value":"author"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"authorEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authorEmail"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"commentOn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentOn"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"parent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parent"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isRestricted"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const GetAuthorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuthor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"defaultValue":{"kind":"StringValue","value":"1","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserNodeIdTypeEnum"}},"defaultValue":{"kind":"EnumValue","value":"DATABASE_ID"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"idType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"social"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facebook"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"linkedIn"}},{"kind":"Field","name":{"kind":"Name","value":"mySpace"}},{"kind":"Field","name":{"kind":"Name","value":"pinterest"}},{"kind":"Field","name":{"kind":"Name","value":"soundCloud"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}},{"kind":"Field","name":{"kind":"Name","value":"wikipedia"}},{"kind":"Field","name":{"kind":"Name","value":"youTube"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"socialAdvanced"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"github"}},{"kind":"Field","name":{"kind":"Name","value":"mastodon"}}]}}]}}]}}]} as unknown as DocumentNode<GetAuthorQuery, GetAuthorQueryVariables>;
export const GetAllCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10000"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exclude"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"defaultValue":{"kind":"ListValue","values":[{"kind":"IntValue","value":"1"},{"kind":"IntValue","value":"96"}]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hideEmpty"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":true}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languages"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LanguageCodeEnum"}}}},"defaultValue":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"DE"},{"kind":"EnumValue","value":"EN"}]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderby"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TermObjectsConnectionOrderbyEnum"}},"defaultValue":{"kind":"EnumValue","value":"NAME"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"exclude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exclude"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderby"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"hideEmpty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hideEmpty"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"languages"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languages"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}}]}}]} as unknown as DocumentNode<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>;
export const GetCommentsByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCommentsById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"defaultValue":{"kind":"StringValue","value":"","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentStatus"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostStatusEnum"}}},"defaultValue":{"kind":"EnumValue","value":"PUBLISH"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderby"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentsConnectionOrderbyEnum"}},"defaultValue":{"kind":"EnumValue","value":"COMMENT_DATE_GMT"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"contentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentStatus"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderby"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentFields"}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contentStatus"},"value":{"kind":"EnumValue","value":"PUBLISH"}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"EnumValue","value":"COMMENT_DATE_GMT"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentFields"}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contentStatus"},"value":{"kind":"EnumValue","value":"PUBLISH"}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"EnumValue","value":"COMMENT_DATE_GMT"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentFields"}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"dateGmt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"parentDatabaseId"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"foundAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCommentsByIdQuery, GetCommentsByIdQueryVariables>;
export const GetMenuItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenuItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LanguageCodeFilterEnum"}},"defaultValue":{"kind":"EnumValue","value":"DE"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MenuLocationEnum"}},"defaultValue":{"kind":"EnumValue","value":"PRIMARY_MENU"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"parentDatabaseId"},"value":{"kind":"IntValue","value":"0"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"childItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMenuItemsQuery, GetMenuItemsQueryVariables>;
export const GetMenuByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenuById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idType"},"value":{"kind":"EnumValue","value":"DATABASE_ID"}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"parentDatabaseId"},"value":{"kind":"IntValue","value":"0"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"childItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMenuByIdQuery, GetMenuByIdQueryVariables>;
export const GetPagesBySlugsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPagesBySlugs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slugs"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"defaultValue":{"kind":"ListValue","values":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"nameIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slugs"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFieldFragment"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFieldFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostTypeSeoFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PostTypeSEO"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"canonical"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"metaRobotsNofollow"}},{"kind":"Field","name":{"kind":"Name","value":"metaRobotsNoindex"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphSiteName"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphDescription"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphPublisher"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphTitle"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphType"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphUrl"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphPublishedTime"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"twitterDescription"}},{"kind":"Field","name":{"kind":"Name","value":"twitterTitle"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFieldFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostTypeSeoFragment"}}]}}]}}]} as unknown as DocumentNode<GetPagesBySlugsQuery, GetPagesBySlugsQueryVariables>;
export const GetAllPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllPosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10000"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languages"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LanguageCodeEnum"}}}},"defaultValue":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"DE"},{"kind":"EnumValue","value":"EN"}]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stati"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostStatusEnum"}}},"defaultValue":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PUBLISH"}]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"96"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"languages"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languages"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"stati"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stati"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"dateGmt"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedGmt"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"editorBlocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"flat"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiVersion"}},{"kind":"Field","name":{"kind":"Name","value":"blockEditorCategoryName"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentClientId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreDetails"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllBlocks"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"foundAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"seo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"social"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facebook"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"linkedIn"}},{"kind":"Field","name":{"kind":"Name","value":"mySpace"}},{"kind":"Field","name":{"kind":"Name","value":"pinterest"}},{"kind":"Field","name":{"kind":"Name","value":"soundCloud"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}},{"kind":"Field","name":{"kind":"Name","value":"wikipedia"}},{"kind":"Field","name":{"kind":"Name","value":"youTube"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"socialAdvanced"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"github"}},{"kind":"Field","name":{"kind":"Name","value":"mastodon"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"mediaItemUrl"}},{"kind":"Field","name":{"kind":"Name","value":"srcSet"}},{"kind":"Field","name":{"kind":"Name","value":"sizes"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"mediaDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"sizes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"commentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"100"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contentStatus"},"value":{"kind":"EnumValue","value":"PUBLISH"}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"EnumValue","value":"COMMENT_DATE_GMT"}},{"kind":"ObjectField","name":{"kind":"Name","value":"parent"},"value":{"kind":"IntValue","value":"0"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentDetails"}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contentStatus"},"value":{"kind":"EnumValue","value":"PUBLISH"}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"EnumValue","value":"COMMENT_DATE_GMT"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentDetails"}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contentStatus"},"value":{"kind":"EnumValue","value":"PUBLISH"}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"EnumValue","value":"COMMENT_DATE_GMT"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentDetails"}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contentStatus"},"value":{"kind":"EnumValue","value":"PUBLISH"}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"EnumValue","value":"COMMENT_DATE_GMT"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentDetails"}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contentStatus"},"value":{"kind":"EnumValue","value":"PUBLISH"}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"EnumValue","value":"COMMENT_DATE_GMT"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentDetails"}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contentStatus"},"value":{"kind":"EnumValue","value":"PUBLISH"}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"EnumValue","value":"COMMENT_DATE_GMT"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentDetails"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"readingTime"}},{"kind":"Field","name":{"kind":"Name","value":"canonical"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"metaRobotsNofollow"}},{"kind":"Field","name":{"kind":"Name","value":"metaRobotsNoindex"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphSiteName"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphDescription"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphPublisher"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphTitle"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphType"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphUrl"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphPublishedTime"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"twitterDescription"}},{"kind":"Field","name":{"kind":"Name","value":"twitterTitle"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreParagraph"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreParagraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"align"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreList"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"innerBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreListItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreHeading"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreHeading"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"textAlign"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreCode"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreCode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"className"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreImage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreImage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"aspectRatio"}},{"kind":"Field","name":{"kind":"Name","value":"caption"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sizeSlug"}},{"kind":"Field","name":{"kind":"Name","value":"src"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mediaDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sizes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"file"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreButton"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"textAlign"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"linkTarget"}},{"kind":"Field","name":{"kind":"Name","value":"rel"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreButtons"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreButtons"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"align"}}]}},{"kind":"Field","name":{"kind":"Name","value":"innerBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreButton"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AcfGithubRawData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AcfGithubRawData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"githubRawData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"codeLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"githubRawUrl"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AcfCodeHighlighting"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AcfCodeHighlighting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllBlocks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EditorBlock"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreParagraph"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreList"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreHeading"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreCode"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreImage"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CoreButtons"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AcfGithubRawData"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AcfCodeHighlighting"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CoreDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CoreDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"showContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"innerBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllBlocks"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"dateGmt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"commentId"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"foundAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllPostsQuery, GetAllPostsQueryVariables>;
export const GetPostsPreviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPostsPreview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10000"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languages"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LanguageCodeEnum"}}}},"defaultValue":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"DE"}]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stati"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostStatusEnum"}}},"defaultValue":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PUBLISH"}]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"field"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostObjectsConnectionOrderbyEnum"}},"defaultValue":{"kind":"EnumValue","value":"AUTHOR"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderEnum"}},"defaultValue":{"kind":"EnumValue","value":"ASC"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"languages"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languages"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"stati"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stati"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"Variable","name":{"kind":"Name","value":"field"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateGmt"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedGmt"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"mediaItemUrl"}},{"kind":"Field","name":{"kind":"Name","value":"srcSet"}},{"kind":"Field","name":{"kind":"Name","value":"sizes"}},{"kind":"Field","name":{"kind":"Name","value":"mediaDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"seo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readingTime"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPostsPreviewQuery, GetPostsPreviewQueryVariables>;
export const GetAllPostPreviewsByCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllPostPreviewsByCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exclude"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"defaultValue":{"kind":"ListValue","values":[{"kind":"IntValue","value":"1"}]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"field"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostObjectsConnectionOrderbyEnum"}},"defaultValue":{"kind":"EnumValue","value":"DATE"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderEnum"}},"defaultValue":{"kind":"EnumValue","value":"DESC"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stati"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostStatusEnum"}}},"defaultValue":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PUBLISH"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"exclude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exclude"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"Variable","name":{"kind":"Name","value":"field"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"stati"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stati"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orderby"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"Variable","name":{"kind":"Name","value":"field"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"stati"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stati"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"language"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"seo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"canonical"}},{"kind":"Field","name":{"kind":"Name","value":"metaDesc"}},{"kind":"Field","name":{"kind":"Name","value":"metaRobotsNofollow"}},{"kind":"Field","name":{"kind":"Name","value":"metaRobotsNoindex"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphSiteName"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphAuthor"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphDescription"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphPublisher"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphTitle"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphType"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphUrl"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphPublishedTime"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"opengraphImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"twitterDescription"}},{"kind":"Field","name":{"kind":"Name","value":"twitterTitle"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllPostPreviewsByCategoryQuery, GetAllPostPreviewsByCategoryQueryVariables>;