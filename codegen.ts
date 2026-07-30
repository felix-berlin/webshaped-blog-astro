import type { CodegenConfig } from "@graphql-codegen/cli";

import { loadEnv } from "vite";

const { WP_API, WP_AUTH_PASS, WP_AUTH_USER } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

const config: CodegenConfig = {
  documents: ["src/**/*.{graphql,js,ts,jsx,tsx}", "!src/gql/**/*", "!src/services/github/**/*"],
  generates: {
    "./schema.graphql": {
      config: {
        includeDirectives: true,
      },
      plugins: ["schema-ast"],
    },
    "./src/gql/": {
      config: {
        useTypeImports: true,
      },
      plugins: [],
      preset: "client",
    },
  },
  hooks: { afterAllFileWrite: ["pnpm exec oxfmt ."] },
  ignoreNoDocuments: true, // for better experience with the watcher
  schema: [
    {
      [WP_API]: {
        headers: {
          Authorization: `Basic ${Buffer.from(`${WP_AUTH_USER}:${WP_AUTH_PASS}`).toString("base64")}`,
        },
      },
    },
  ],
};

export default config;
