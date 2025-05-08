import type { CreateCommentPayload } from "@ts_types/generated/graphql";

export * from "@services/mutations/createComment";
export * from "@services/queries/getMenu";
export * from "@services/queries/getCategory";
export * from "@services/queries/getPage";
export * from "@services/queries/getComment";
export * from "@services/queries/getPost";
export * from "@services/queries/getPostPreview";
export * from "@services/queries/getAuthor";

interface Error {
  message?: string;
  extensions?: {
    category: string;
  };
  locations?: {
    line: number;
    column: number;
  }[];
  path?: string[];
}

interface QueryResult {
  errors?: Error[];
  extensions?: {
    debug: Array<string | object | boolean>;
    queryAnalyzer: {
      keys: string;
      keysLength: number;
      keysCount: number;
      skippedKeys: string;
      skippedKeysSize: number;
      skippedKeysCount: number;
      skippedTypes: Array<string | object | boolean>;
    };
  };
}

export interface CreateCommentPayloadExtended extends CreateCommentPayload, QueryResult {}
