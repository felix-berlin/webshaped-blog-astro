import type { CreateCommentPayload } from "@ts_types/generated/graphql";

export * from "@services/createComment";
export * from "@services/getMenu";
export * from "@services/getCategory";
export * from "@services/getPage";
export * from "@services/getComment";
export * from "@services/getPost";
export * from "@services/getPostPreview";
export * from "@services/getAuthor";

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
