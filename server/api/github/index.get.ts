// All public repos on the account, most recently pushed first. Cached 1h (in KV on Cloudflare).
export default defineCachedEventHandler(
  async () => {
    // ponytail: one page of 100; paginate if the account ever passes 100 repos
    const repos = await useGitHub()<any[]>(`/users/${GITHUB_OWNER}/repos`, {
      query: { type: "owner", sort: "pushed", per_page: 100 },
    });

    return repos.map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stargazers_count: r.stargazers_count,
      pushed_at: r.pushed_at,
      fork: r.fork,
      archived: r.archived,
    }));
  },
  {
    name: "github-repos",
    maxAge: 60 * 60, // 1h: keeps KV writes well under the free tier's 1000/day
    swr: true,
  },
);
