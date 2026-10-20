// Pushes per repo per day over the last DAYS days, from GitHub's public events feed.
// Days are counted in Madison time so "today" matches the site's owner. Cached 1h.
const DAYS = 14;
const TZ = "America/Chicago";
const DAY_MS = 86_400_000;

// "2026-10-19" in TZ -> whole days since epoch, so days can be subtracted
const dayNumber = (date: Date) =>
  Date.parse(date.toLocaleDateString("en-CA", { timeZone: TZ })) / DAY_MS;

const agoLabel = (ago: number) =>
  ago === 0 ? "today" : ago === 1 ? "yesterday" : `${ago} days ago`;

export default defineCachedEventHandler(
  async () => {
    // ponytail: one page of 100 events; plenty for 14 days unless pushes get very frequent
    const events = await useGitHub()<any[]>(
      `/users/${GITHUB_OWNER}/events/public`,
      {
        query: { per_page: 100 },
      },
    );

    const now = new Date();
    const today = dayNumber(now);
    const repos = new Map<
      string,
      { name: string; days: number[]; lastAgo: number }
    >();

    for (const e of events) {
      if (e.type !== "PushEvent") continue;
      const ago = today - dayNumber(new Date(e.created_at));
      if (ago < 0 || ago >= DAYS) continue;
      const name = e.repo.name.split("/")[1];
      const repo = repos.get(name) ?? {
        name,
        days: Array(DAYS).fill(0),
        lastAgo: ago,
      };
      repo.days[DAYS - 1 - ago]++; // oldest first
      repo.lastAgo = Math.min(repo.lastAgo, ago);
      repos.set(name, repo);
    }

    // Labels for each day column, e.g. "Oct 19"
    const dates = Array.from({ length: DAYS }, (_, i) =>
      new Date(now.getTime() - (DAYS - 1 - i) * DAY_MS).toLocaleDateString(
        "en-US",
        {
          timeZone: TZ,
          month: "short",
          day: "numeric",
        },
      ),
    );

    // every repo pushed to in the window, most recent first (home shows the top few,
    // project pages look up their own)
    const all = [...repos.values()]
      .sort((a, b) => a.lastAgo - b.lastAgo || sum(b.days) - sum(a.days))
      .map(({ name, days, lastAgo }) => ({
        name,
        days,
        last: agoLabel(lastAgo),
      }));

    return { dates, repos: all };
  },
  {
    name: "github-activity",
    maxAge: 60 * 60, // 1h: keeps KV writes well under the free tier's 1000/day
    swr: true,
  },
);

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
