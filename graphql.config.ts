import type { IGraphQLConfig } from "graphql-config";

const config: IGraphQLConfig = {
  schema: "./graphql.schema.json",
  documents: "src/**/*.{graphql,js,ts,jsx,tsx}",
};

export default config;
