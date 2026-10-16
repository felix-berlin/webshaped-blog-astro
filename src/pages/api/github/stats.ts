import type { AnyVariables, DocumentInput } from "@urql/core";

import { captureException } from "@sentry/astro";
import GhRepos from "@services/github/GhRepos.graphql";
import GhSingleRepo from "@services/github/GhSingleRepo.graphql";
import { Client, fetchExchange } from "@urql/core";
import { GITHUB_TOKEN } from "astro:env/server";

/** Response body of GET /api/github/stats (consumed by GithubStats.vue). */
export type GithubStats = {
  languagePercentages: { language: string; percentage: number }[];
  mostStarredRepos: RepoSummary[];
};

export type RepoSummary = {
  description: string;
  mostUsedLanguage: string;
  name: string;
  stars: number;
  url: string;
};

type RepoNode = {
  description?: null | string;
  languages: { edges: { node: { name: string }; size: number }[] };
  name: string;
  stargazerCount: number;
  url: string;
};

type ReposQueryData = {
  viewer: {
    repositories: {
      nodes?: Array<null | RepoNode>;
      pageInfo: { endCursor: null | string; hasNextPage: boolean };
    };
  };
};

type SingleRepoQueryData = { repository?: null | RepoNode };

const CACHE_TTL_MS = 60 * 60 * 1000;

const client = new Client({
  exchanges: [fetchExchange],
  fetchOptions: { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } },
  preferGetMethod: false,
  url: "https://api.github.com/graphql",
});

// Additional repos (owner/name) that aren't owned by the token's user.
const extraRepos = [{ name: "publication2023", owner: "bitsundbaeume" }];

/** Query GitHub and throw on any error, naming the request that failed. */
const ghQuery = async <TData, TVariables extends AnyVariables>(
  label: string,
  query: DocumentInput<TData, TVariables>,
  variables: TVariables,
): Promise<TData> => {
  const { data, error } = await client.query(query, variables).toPromise();
  if (error || !data) throw new Error(`Error fetching ${label}: ${error?.message ?? "no data"}`);
  return data;
};

const fetchOwnRepos = async (): Promise<RepoNode[]> => {
  const repos: RepoNode[] = [];
  let after: null | string = null;

  do {
    const { viewer }: ReposQueryData = await ghQuery<ReposQueryData, { after: null | string }>(
      "repositories",
      GhRepos,
      { after },
    );
    repos.push(...(viewer.repositories.nodes ?? []).filter((repo) => repo !== null));
    after = viewer.repositories.pageInfo.hasNextPage
      ? viewer.repositories.pageInfo.endCursor
      : null;
  } while (after);

  return repos;
};

// A missing extra repo shouldn't take down the whole endpoint — but it is reported,
// since the partial result is then cached for the full TTL.
const fetchExtraRepo = ({ name, owner }: { name: string; owner: string }) =>
  ghQuery<SingleRepoQueryData, { name: string; owner: string }>("extra repo", GhSingleRepo, {
    name,
    owner,
  })
    .then(({ repository }) => (repository ? [repository] : []))
    .catch((error: Error) => {
      console.warn(`Skipping extra repo ${owner}/${name}: ${error.message}`);
      captureException(error);
      return [];
    });

const buildStats = async (): Promise<GithubStats> => {
  const [ownRepos, ...extra] = await Promise.all([
    fetchOwnRepos(),
    ...extraRepos.map(fetchExtraRepo),
  ]);
  const repos = [...ownRepos, ...extra.flat()];

  const languages: Record<string, number> = {};
  let totalBytes = 0;
  for (const { node, size } of repos.flatMap((repo) => repo.languages.edges)) {
    languages[node.name] = (languages[node.name] ?? 0) + size;
    totalBytes += size;
  }

  return {
    languagePercentages: Object.entries(languages)
      .map(([language, bytes]) => ({ language, percentage: (bytes / (totalBytes || 1)) * 100 }))
      .sort((a, b) => b.percentage - a.percentage),
    mostStarredRepos: repos
      .map((repo) => ({
        description: repo.description || "No description available",
        mostUsedLanguage: repo.languages.edges[0]?.node.name || "Unknown",
        name: repo.name,
        stars: repo.stargazerCount,
        url: repo.url,
      }))
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 6),
  };
};

// Crawling every repo is slow and rate-limited, so the result is shared by all
// visitors for as long as browsers may cache it anyway. Failures aren't cached.
let cache: undefined | { expires: number; stats: Promise<GithubStats> };

const getStats = (): Promise<GithubStats> => {
  if (!cache || cache.expires < Date.now()) {
    const stats = buildStats();
    cache = { expires: Date.now() + CACHE_TTL_MS, stats };
    stats.catch(() => (cache = undefined));
  }
  return cache.stats;
};

export async function GET(): Promise<Response> {
  try {
    return new Response(JSON.stringify(await getStats()), {
      headers: { "Cache-Control": "public, max-age=3600", "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error fetching data from API: ${message}`);
    captureException(error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
