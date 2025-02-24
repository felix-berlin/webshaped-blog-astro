import { SITE_URL } from "astro:env/client";

export const fetchAPI = async (query: string, { variables } = { variables: {} }): Promise<any> => {
  try {
    const response = await fetch(`${SITE_URL}/api/cms`, {
      method: "POST",
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch API error:", error);
    throw error;
  }
};
