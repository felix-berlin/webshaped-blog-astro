import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Variables } from "@urql/core";

import { Client, fetchExchange } from "@urql/core";
import { WP_API } from "astro:env/client";

// Define a generic type for GraphQL variables
// type Variables = Record<string, any>;

// const baseUrl = import.meta.env.DEV ? SITE_URL : "";

// export const fetchAPI = async (query: string, { variables } = { variables: {} }): Promise<any> => {
//   try {
//     const response = await fetch(`${baseUrl}/api/cms`, {
//       method: "POST",
//       body: JSON.stringify({ query, variables }),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Fetch API error:", error);
//     throw error;
//   }
// };

export const fetchAPI = async (query: string, { variables } = { variables: {} }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  return await fetch(WP_API, {
    body: JSON.stringify({ query, variables }),
    headers,
    method: "POST",
  })
    .then(async (response) => {
      if (response.ok) {
        // console.log('response', response);

        return await response.json();
      } else {
        const errorMessage = await response.text();
        return Promise.reject(new Error(errorMessage));
      }
    })
    .catch((error) => {
      console.error("error", error);
    });
};

export const fetchApiWithAuth = async (
  authToken: string,
  query: string,
  { variables } = { variables: {} },
) => {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  return await fetch(WP_API, {
    body: JSON.stringify({ query, variables }),
    headers,
    method: "POST",
  })
    .then(async (response) => {
      if (response.ok) {
        const jsonData = await response.json(); // Read the response body once

        return jsonData; // Return the data
      } else {
        const errorMessage = await response.text();
        return Promise.reject(new Error(errorMessage));
      }
    })
    .catch((error) => {
      console.error("error", error);
    });
};

export const gqlApi = async <T, V extends Variables>(
  query: TypedDocumentNode<T, V>,
  variables: V,
): Promise<T> => {
  const client = new Client({
    exchanges: [fetchExchange],
    fetchOptions: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    url: WP_API,
  });

  const result = await client.query<T, V>(query, variables).toPromise();

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data) {
    throw new Error("No data returned from the GraphQL query.");
  }

  return result.data; // Return only the strongly typed data
};

export const client: InstanceType<typeof Client> = new Client({
  exchanges: [fetchExchange],
  fetchOptions: {
    headers: {
      "Content-Type": "application/json",
    },
  },
  url: WP_API,
});
