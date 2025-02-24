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
    }

    const languagePercentages: { [key: string]: number } = {};
    for (const [language, bytesOfCode] of Object.entries(languages)) {
      languagePercentages[language] = (bytesOfCode / totalBytes) * 100;
    }

    return new Response(
      JSON.stringify({
        languagePercentages,
        totalBytes,
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
