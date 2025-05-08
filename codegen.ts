import type { CodegenConfig } from "@graphql-codegen/cli";
import { loadEnv } from "vite";

const { WP_AUTH_REFRESH_TOKEN, WP_API } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

const config: CodegenConfig = {
  schema: [
    {
      [WP_API]: {
        headers: {
          Authorization: `Bearer ${WP_AUTH_REFRESH_TOKEN}`,
        },
      },
    },
  ],
  documents: ["src/**/*.{graphql,js,ts,jsx,tsx}", "!src/services/ghRepos.graphql", "!src/gql/**/*"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        useTypeImports: true,
      },
      plugins: [],
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;

// Old codegen config
// const config: CodegenConfig = {
//   schema: [
//     {
//       [WP_API]: {
//         headers: {
//           Authorization: `Bearer ${WP_AUTH_REFRESH_TOKEN}`,
//         },
//       },
//     },
//   ],
//   generates: {
//     "src/types/generated/graphql.d.ts": {
//       plugins: ["typescript", "typescript-operations"],
//       config: {
//         maybeValue: "T | null | undefined",
//       },
//     },
//     "./graphql.schema.json": {
//       plugins: ["introspection"],
//     },
//   },
// };

// export default config;
