import type { APIRoute } from "astro";

import { WP_API } from "astro:env/client";
import { WP_AUTH_REFRESH_TOKEN } from "astro:env/server";

const fetchAPI = async (query: string, { variables } = { variables: {} }) => {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${WP_AUTH_REFRESH_TOKEN}`,
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const { query, variables } = await request.json();
    const data = await fetchAPI(query, { variables });

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
};
