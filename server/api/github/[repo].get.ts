// GitHub repo names: letters, digits, ".", "_", "-", up to 100 chars.
const VALID_REPO = /^[a-z0-9._-]{1,100}$/;

// Cached for 10 min per repo, including "not found" (null), so neither page
// views nor junk URLs hit GitHub repeatedly. Errors (e.g. rate limits) aren't
// cached; with swr the last good copy keeps being served meanwhile.
const getProject = defineCachedFunction(
  async (repo: string) => {
    const github = useGitHub();
    const gh = <T>(path: string, opts?: any) =>
      github<T>(`/repos/${GITHUB_OWNER}/${repo}${path}`, opts);

    const project = await orNull(gh<any>(""));
    if (!project || project.private) return null;

    const [readme, release, commits] = await Promise.all([
      orNull(
        gh<string>("/readme", {
          headers: { Accept: "application/vnd.github.html" },
          responseType: "text",
        }),
      ),
      orNull(gh<any>("/releases/latest")),
      orNull(
        gh<any[]>("/commits", {
          query: { sha: project.default_branch, per_page: 6 },
        }),
      ),
    ]);

    // README links/images like "docs/logo.png" are relative to the repo, so they'd
    // break on this site; point them at GitHub instead.
    const branch = project.default_branch;
    const readmeHtml = readme?.replace(
      /(src|href)="(?![a-z][a-z0-9+.-]*:|\/\/|#)(?:\.\/|\/)?([^"]*)"/gi,
      (_, attr, path) =>
        attr === "src"
          ? `src="https://raw.githubusercontent.com/${GITHUB_OWNER}/${project.name}/${branch}/${path}"`
          : `href="${project.html_url}/blob/${branch}/${path}"`,
    );

    return {
      project,
      readme: readmeHtml ?? null,
      // notes are left on GitHub; the page only shows the summary
      release: release && {
        tag_name: release.tag_name,
        name: release.name,
        published_at: release.published_at,
        html_url: release.html_url,
      },
      commits: commits ?? [],
    };
  },
  {
    name: "github-project",
    getKey: (repo: string) => repo,
    maxAge: 60 * 10,
    swr: true,
  },
);

export default defineEventHandler(async (event) => {
  // GitHub names are case-insensitive; lowercase so /Evoker and /evoker share a cache entry.
  const repo = getRouterParam(event, "repo")!.toLowerCase();

  const data = VALID_REPO.test(repo) ? await getProject(repo) : null;
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Project not found" });
  }
  return data;
});
