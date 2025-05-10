import type { APIContext } from "astro";
import { GITHUB_TOKEN } from "astro:env/server";
import { Client, fetchExchange } from "@urql/core";
import GhRepos from "@services/github/GhRepos.graphql";
import GhSingleRepo from "@services/github/GhSingleRepo.graphql";
import { cacheExchange } from "@urql/exchange-graphcache";

// --- Types ---
type RepoNode = {
  name: string;
  stargazerCount: number;
  url: string;
  description?: string;
  forkCount: number;
  languages: { edges: { node: { name: string }; size: number }[] };
  defaultBranchRef?: {
    target?: {
      history?: { totalCount?: number };
    };
  };
};

type RepoSummary = {
  name: string;
  stars: number;
  url: string;
  description: string;
  mostUsedLanguage: string;
  forkCount: number;
};

// --- Cache config ---
const cache = cacheExchange({
  resolvers: {
    User: {
      repositories: (parent, args) => ({
        __typename: "RepositoryConnection",
        args,
      }),
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

// --- Helper: Aggregate repo data ---
function aggregateRepoData(
  repo: RepoNode,
  languages: Record<string, number>,
  mostStarredRepos: RepoSummary[],
  totals: { bytes: number; commits: number },
) {
  for (const language of repo.languages.edges) {
    const languageName = language.node.name;
    const size = language.size;
    if (!languages[languageName]) languages[languageName] = 0;
    languages[languageName] += size;
    totals.bytes += size;
  }
  if (repo.defaultBranchRef?.target?.history?.totalCount) {
    totals.commits += repo.defaultBranchRef.target.history.totalCount;
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

export async function GET(context: APIContext): Promise<Response> {
  try {
    // --- Fetch user info ---
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

    // --- Aggregation setup ---
    let hasNextPage = true;
    let after: string | null = null;
    const languages: Record<string, number> = {};
    const mostStarredRepos: RepoSummary[] = [];
    const totals = { bytes: 0, commits: 0 };

    // --- Fetch all user repos (paginated) ---
    while (hasNextPage) {
      const reposResponse = await client.query(GhRepos, { username, after }).toPromise();
      if (reposResponse.error) {
        throw new Error(`Error fetching repositories: ${reposResponse.error.message}`);
      }
      const repositories = reposResponse.data.user.repositories;
      hasNextPage = repositories.pageInfo.hasNextPage;
      after = repositories.pageInfo.endCursor;

      for (const repo of repositories.nodes as RepoNode[]) {
        aggregateRepoData(repo, languages, mostStarredRepos, totals);
      }
    }

    // --- Fetch and merge extra repos ---
    for (const { owner, name } of extraRepos) {
      const singleRepoResponse = await client.query(GhSingleRepo, { owner, name }).toPromise();
      if (singleRepoResponse.error) {
        console.warn(`Skipping extra repo ${owner}/${name}: ${singleRepoResponse.error.message}`);
        continue;
      }
      const repo = singleRepoResponse.data.repository as RepoNode | undefined;
      if (!repo) continue;
      aggregateRepoData(repo, languages, mostStarredRepos, totals);
    }

    // --- Sort and limit starred repos ---
    const topStarredRepos = mostStarredRepos.sort((a, b) => b.stars - a.stars).slice(0, 6);

    // --- Calculate language percentages ---
    const languagePercentages = Object.entries(languages)
      .map(([language, bytesOfCode]) => ({
        language,
        percentage: (bytesOfCode / (totals.bytes || 1)) * 100,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // --- Response ---
    return new Response(
      JSON.stringify({
        languagePercentages,
        totalBytes: totals.bytes,
        totalCommits: totals.commits,
        mostStarredRepos: topStarredRepos,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error(`Error fetching data from API: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
