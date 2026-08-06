import type { OperationResult } from "@urql/core";

import GhRepos from "@services/github/GhRepos.graphql";
import GhSingleRepo from "@services/github/GhSingleRepo.graphql";
import { cacheExchange, Client, fetchExchange } from "@urql/core";
import { GITHUB_TOKEN } from "astro:env/server";

// --- Types ---
type RepoNode = {
  defaultBranchRef?: {
    target?: {
      history?: { totalCount?: number };
    };
  };
  description?: string;
  forkCount: number;
  languages: { edges: { node: { name: string }; size: number }[] };
  name: string;
  stargazerCount: number;
  url: string;
};

type ReposQueryData = {
  user?: null | {
    repositories?: null | {
      nodes?: Array<null | RepoNode>;
      pageInfo?: null | {
        endCursor: null | string;
        hasNextPage: boolean;
      };
    };
  };
};

type RepoSummary = {
  description: string;
  forkCount: number;
  mostUsedLanguage: string;
  name: string;
  stars: number;
  url: string;
};

type SingleRepoQueryData = {
  repository?: null | RepoNode;
};

type ViewerQueryData = {
  viewer?: null | {
    login?: null | string;
  };
};

const USER_QUERY = `
  query {
    viewer {
      id
      login
    }
  }
`;

const client = new Client({
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  },
  preferGetMethod: false,
  url: "https://api.github.com/graphql",
});

// List of additional repos (owner/name)
const extraRepos = [{ name: "publication2023", owner: "bitsundbaeume" }];

export async function GET(): Promise<Response> {
  try {
    const userResponse = await client
      .query<ViewerQueryData, Record<string, never>>(
        USER_QUERY,
        {},
        { requestPolicy: "network-only" },
      )
      .toPromise();

    if (userResponse.error) {
      throw new Error(`Error fetching user info: ${userResponse.error.message}`);
    }

    const username = userResponse.data?.viewer?.login;
    if (!username) {
      throw new Error("Could not resolve GitHub username from viewer query.");
    }

    // --- Aggregation setup ---
    let hasNextPage = true;
    let after: null | string = null;
    const languages: Record<string, number> = {};
    const mostStarredRepos: RepoSummary[] = [];
    const totals = { bytes: 0, commits: 0 };

    // --- Fetch all user repos (paginated) ---
    while (hasNextPage) {
      const reposResponse: OperationResult<ReposQueryData> = await client
        .query<ReposQueryData, { after: null | string; username: string }>(
          GhRepos,
          { after, username },
          { requestPolicy: "network-only" },
        )
        .toPromise();

      if (reposResponse.error) {
        throw new Error(`Error fetching repositories: ${reposResponse.error.message}`);
      }

      const repositories = reposResponse.data?.user?.repositories;
      if (!repositories?.pageInfo) {
        throw new Error("Unexpected repositories response from GitHub GraphQL API.");
      }

      hasNextPage = repositories.pageInfo.hasNextPage;
      after = repositories.pageInfo.endCursor;

      for (const repo of repositories.nodes ?? []) {
        if (!repo) continue;
        aggregateRepoData(repo, languages, mostStarredRepos, totals);
      }
    }

    // --- Fetch and merge extra repos ---
    for (const { name, owner } of extraRepos) {
      const singleRepoResponse = await client
        .query<SingleRepoQueryData, { name: string; owner: string }>(
          GhSingleRepo,
          { name, owner },
          { requestPolicy: "network-only" },
        )
        .toPromise();

      if (singleRepoResponse.error) {
        console.warn(`Skipping extra repo ${owner}/${name}: ${singleRepoResponse.error.message}`);
        continue;
      }

      const repo = singleRepoResponse.data?.repository;
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
        mostStarredRepos: topStarredRepos,
        totalBytes: totals.bytes,
        totalCommits: totals.commits,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error fetching data from API: ${message}`);
    return new Response(JSON.stringify({ error: message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

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
    description: repo.description || "No description available",
    forkCount: repo.forkCount,
    mostUsedLanguage,
    name: repo.name,
    stars: repo.stargazerCount,
    url: repo.url,
  });
}
