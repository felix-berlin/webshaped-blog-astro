import type { APIContext } from "astro";
import { GITHUB_TOKEN } from "astro:env/server";

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

interface Repo {
  name: string;
}

interface Languages {
  [key: string]: number;
}

interface Commit {
  total: number;
}

interface Stats {
  additions: number;
  deletions: number;
}

async function fetchAllRepos(username: string): Promise<Repo[]> {
  let repos: Repo[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}&affiliation=owner`,
      {
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching repositories: ${response.statusText}`);
    }

    const pageRepos = (await response.json()) as Repo[];
    repos = repos.concat(pageRepos);

    const linkHeader = response.headers.get("Link");
    if (linkHeader?.includes('rel="next"')) {
      page++;
    } else {
      hasNextPage = false;
    }
  }

  return repos;
}

async function fetchTotalCommits(username: string, repoName: string): Promise<number> {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${repoName}/commits?per_page=1`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(`Error fetching commits for repo ${repoName}: ${response.statusText}`);
  }

  const linkHeader = response.headers.get("Link");
  if (linkHeader) {
    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  const commits = (await response.json()) as Commit[];
  return commits.length;
}

async function fetchTotalAdditions(username: string, repoName: string): Promise<number> {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${repoName}/stats/code_frequency`,
    { headers },
  );

  if (!response.ok) {
    console.error(`Error fetching code frequency for repo ${repoName}: ${response.statusText}`);
    return 0;
  }

  const stats = await response.json();

  if (!Array.isArray(stats)) {
    console.error(`Unexpected response format for code frequency: ${JSON.stringify(stats)}`);
    return 0;
  }

  return stats.reduce((total, stat) => {
    if (Array.isArray(stat) && stat.length >= 3) {
      return total + stat[1]; // stat[1] is the number of additions
    } else {
      console.error(`Unexpected stat format: ${JSON.stringify(stat)}`);
      return total;
    }
  }, 0);
}

export async function GET(context: APIContext): Promise<Response> {
  try {
    const userResponse = await fetch("https://api.github.com/user", { headers });
    if (!userResponse.ok) {
      console.error(`Error fetching user info: ${userResponse.statusText}`);
      throw new Error(`Error fetching user info: ${userResponse.statusText}`);
    }
    const userData = await userResponse.json();
    const username = userData.login;

    const repos = await fetchAllRepos(username);

    const languages: Languages = {};
    let totalBytes = 0;
    let totalCommits = 0;
    let totalAdditions = 0;

    for (const repo of repos) {
      const languagesResponse = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/languages`,
        { headers },
      );
      if (!languagesResponse.ok) {
        console.error(
          `Error fetching languages for repo ${repo.name}: ${languagesResponse.statusText}`,
        );
        throw new Error(
          `Error fetching languages for repo ${repo.name}: ${languagesResponse.statusText}`,
        );
      }
      const repoLanguages = (await languagesResponse.json()) as Languages;

      for (const [language, bytesOfCode] of Object.entries(repoLanguages)) {
        if (!languages[language]) {
          languages[language] = 0;
        }
        languages[language] += bytesOfCode;
        totalBytes += bytesOfCode;
      }

      const repoCommits = await fetchTotalCommits(username, repo.name);
      totalCommits += repoCommits;

      const repoAdditions = await fetchTotalAdditions(username, repo.name);
      totalAdditions += repoAdditions;
    }

    const languagePercentages: { [key: string]: number } = {};
    for (const [language, bytesOfCode] of Object.entries(languages)) {
      languagePercentages[language] = (bytesOfCode / totalBytes) * 100;
    }

    return new Response(
      JSON.stringify({
        languagePercentages,
        totalBytes,
        totalCommits,
        totalAdditions,
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
