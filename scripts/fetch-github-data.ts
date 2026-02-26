import { Octokit } from "@octokit/rest";

// GitHub's standard language colors
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Astro: "#ff5a03",
  Kotlin: "#A97BFF",
  Shell: "#89e051",
  SCSS: "#c6538c",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Lua: "#000080",
  Dart: "#00B4AB",
  Swift: "#F05138",
};

export interface GitHubData {
  user: {
    login: string;
    name: string;
    bio: string;
    publicRepos: number;
    followers: number;
    following: number;
    createdAt: string;
  };
  languages: {
    name: string;
    bytes: number;
    percentage: number;
    color: string;
  }[];
  totalStars: number;
  totalForks: number;
  topRepos: {
    name: string;
    stars: number;
    language: string | null;
    description: string | null;
  }[];
}

export async function fetchGitHubData(username: string): Promise<GitHubData> {
  const token = process.env.GITHUB_TOKEN;
  const octokit = new Octokit(token ? { auth: token } : {});

  // Fetch user profile
  const { data: user } = await octokit.users.getByUsername({ username });

  // Fetch all repos (handles pagination)
  const repos = await octokit.paginate(octokit.repos.listForUser, {
    username,
    per_page: 100,
    type: "owner",
  });

  // Filter out forks
  const ownRepos = repos.filter((r) => !r.fork);

  // Aggregate language bytes across all repos
  const languageBytes: Record<string, number> = {};
  let totalStars = 0;
  let totalForks = 0;

  await Promise.all(
    ownRepos.map(async (repo) => {
      totalStars += repo.stargazers_count ?? 0;
      totalForks += repo.forks_count ?? 0;

      try {
        const { data: langs } = await octokit.repos.listLanguages({
          owner: username,
          repo: repo.name,
        });
        for (const [lang, bytes] of Object.entries(langs)) {
          languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
        }
      } catch {
        // Skip repos where we can't fetch languages
      }
    }),
  );

  // Calculate percentages and sort
  const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
  const languages = Object.entries(languageBytes)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
      color: LANGUAGE_COLORS[name] || "#8b8b8b",
    }))
    .sort((a, b) => b.bytes - a.bytes);

  // Top repos by stars
  const topRepos = ownRepos
    .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count ?? 0,
      language: r.language ?? null,
      description: r.description,
    }));

  return {
    user: {
      login: user.login,
      name: user.name || username,
      bio: user.bio || "",
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at,
    },
    languages,
    totalStars,
    totalForks,
    topRepos,
  };
}
