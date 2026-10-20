const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// RSS 2.0, prerendered at build time like the sitemap.
export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig().public;
  const items = (await listArticles())
    .map((a) => {
      const link = `${siteUrl}${a.path}`;
      return `<item>
  <title>${esc(a.title)}</title>
  <link>${link}</link>
  <guid>${link}</guid>
  <pubDate>${new Date(`${a.date}T12:00:00Z`).toUTCString()}</pubDate>${a.description ? `\n  <description>${esc(a.description)}</description>` : ""}${a.tags.map((t) => `\n  <category>${esc(t)}</category>`).join("")}
</item>`;
    })
    .join("\n");
  setHeader(event, "content-type", "application/rss+xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>Gavin Smith's Blog</title>
<link>${siteUrl}/blog</link>
<description>Posts from Gavin Smith</description>
<language>en</language>
${items}
</channel>
</rss>`;
});
