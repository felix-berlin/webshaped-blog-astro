import type { APIContext } from "astro";
import { GITHUB_TOKEN } from "astro:env/server";
import { Client, cacheExchange, fetchExchange } from "@urql/core";
import GhRepos from "@services/ghRepos.graphql";

const client = new Client({
  url: "https://api.github.com/graphql",
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  },
  exchanges: [cacheExchange, fetchExchange],
});

export async function GET(context: APIContext): Promise<Response> {
  try {
    // Fetch user information
    const USER_QUERY = `
      query {
        viewer {
          login
        }
      }
    `;

    const userResponse = await client.query(USER_QUERY, {}).toPromise();

    if (userResponse.error) {
      throw new Error(`Error fetching user info: ${userResponse.error.message}`);
    }

    const username = userResponse.data.viewer.login;

    // Fetch repositories and aggregate data
    let hasNextPage = true;
    let after: string | null = null;
    const languages: { [key: string]: number } = {};
    let totalBytes = 0;
    let totalCommits = 0;

    while (hasNextPage) {
      const reposResponse = await client.query(GhRepos, { username, after }).toPromise();

      if (reposResponse.error) {
        throw new Error(`Error fetching repositories: ${reposResponse.error.message}`);
      }

      const repositories = reposResponse.data.user.repositories;
      hasNextPage = repositories.pageInfo.hasNextPage;
      after = repositories.pageInfo.endCursor;

      for (const repo of repositories.nodes) {
        // Aggregate language data
        for (const language of repo.languages.edges) {
          const languageName = language.node.name;
          const size = language.size;

          if (!languages[languageName]) {
            languages[languageName] = 0;
          }
          languages[languageName] += size;
          totalBytes += size;
        }

        // Aggregate commit data
        if (repo.defaultBranchRef?.target?.history?.totalCount) {
          totalCommits += repo.defaultBranchRef.target.history.totalCount;
        }
      }
    }

    // Calculate language percentages
    const languagePercentages: { [key: string]: number } = {};
    for (const [language, bytesOfCode] of Object.entries(languages)) {
      languagePercentages[language] = (bytesOfCode / totalBytes) * 100;
    }

    return new Response(
      JSON.stringify({
        languagePercentages,
        totalBytes,
        totalCommits,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error(`Error fetching data from API: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
