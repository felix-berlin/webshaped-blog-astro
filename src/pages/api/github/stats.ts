import type { APIContext } from "astro";
import { GITHUB_TOKEN } from "astro:env/server";
import { Client, fetchExchange } from "@urql/core";
import GhRepos from "@services/github/GhRepos.graphql";
import GhSingleRepo from "@services/github/GhSingleRepo.graphql";
import { cacheExchange } from "@urql/exchange-graphcache";

const cache = cacheExchange({
  resolvers: {
    User: {
      repositories: (parent, args, cache, info) => {
        return {
          __typename: "RepositoryConnection",
          // Wichtig: args als key für Pagination
          args,
        };
      },
    },
  },
  keys: {
    RepositoryConnection: () => null,
    Repository: (repo) => `${repo.owner?.login ?? "unknown"}/${repo.name}`,
    User: () => null,
    Language: () => null,
    Ref: () => null,
    Commit: () => null,
  },
  // TTL-Konfiguration (1 Tag in Millisekunden)
  ttl: 24 * 60 * 60 * 1000,
});

const client = new Client({
  url: "https://api.github.com/graphql",
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  },
  exchanges: [cache, fetchExchange],
});

// List of additional repos (owner/name)
const extraRepos = [{ owner: "bitsundbaeume", name: "publication2023" }];

export async function GET(context: APIContext): Promise<Response> {
  try {
    // Fetch user information
    const USER_QUERY = `
      query {
        viewer {
          id
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
    let mostStarredRepos: {
      name: string;
      stars: number;
      url: string;
      description: string;
      mostUsedLanguage: string;
      forkCount: number;
    }[] = [];

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

        // Collect most starred repositories
        const mostUsedLanguage = repo.languages.edges[0]?.node.name || "Unknown";
        mostStarredRepos.push({
          name: repo.name,
          stars: repo.stargazerCount,
          url: repo.url,
          description: repo.description || "No description available",
          mostUsedLanguage,
          forkCount: repo.forkCount,
        });
      }
    }

    // get additional single repos and merge them
    for (const { owner, name } of extraRepos) {
      const singleRepoResponse = await client.query(GhSingleRepo, { owner, name }).toPromise();
      if (singleRepoResponse.error) continue; // Fehlerhafte Repos überspringen
      const repo = singleRepoResponse.data.repository;
      if (!repo) continue;
      for (const language of repo.languages.edges) {
        const languageName = language.node.name;
        const size = language.size;
        if (!languages[languageName]) languages[languageName] = 0;
        languages[languageName] += size;
        totalBytes += size;
      }
      if (repo.defaultBranchRef?.target?.history?.totalCount) {
        totalCommits += repo.defaultBranchRef.target.history.totalCount;
      }
      const mostUsedLanguage = repo.languages.edges[0]?.node.name || "Unknown";
      mostStarredRepos.push({
        name: repo.name,
        stars: repo.stargazerCount,
        url: repo.url,
        description: repo.description || "No description available",
        mostUsedLanguage,
        forkCount: repo.forkCount,
      });
    }

    // Sort repositories by stars and limit to top 6
    mostStarredRepos = mostStarredRepos.sort((a, b) => b.stars - a.stars).slice(0, 6);

    // Calculate language percentages
    const languagePercentages: { [key: string]: number } = {};
    for (const [language, bytesOfCode] of Object.entries(languages)) {
      languagePercentages[language] = (bytesOfCode / totalBytes) * 100;
    }

    // Sort languages by percentage descending
    const sortedLanguages = Object.entries(languagePercentages)
      .sort((a, b) => b[1] - a[1])
      .map(([language, percentage]) => ({ language, percentage }));

    return new Response(
      JSON.stringify({
        languagePercentages: sortedLanguages,
        totalBytes,
        totalCommits,
        mostStarredRepos,
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
