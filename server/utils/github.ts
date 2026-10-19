export const GITHUB_OWNER = "gavinhsmith";

// Fetch from the GitHub API, using NUXT_GITHUB_TOKEN when set.
export const useGitHub = () => {
  const { githubToken } = useRuntimeConfig();
  return $fetch.create({
    baseURL: "https://api.github.com",
    headers: {
      "User-Agent": GITHUB_OWNER,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(githubToken && { Authorization: `Bearer ${githubToken}` }),
    },
  });
};

// Treat "doesn't exist" (404: no readme / no releases, 409: empty repo) as null;
// anything else (rate limit, GitHub down) is a real error.
export const orNull = <T>(p: Promise<T>) =>
  p.catch((e) => {
    if ([404, 409].includes(e?.response?.status)) return null;
    throw e;
  });
