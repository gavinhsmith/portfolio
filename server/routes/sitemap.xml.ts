// Prerendered at build time (see nuxt.config.ts), so it updates whenever an article is added.
export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig().public;
  const pages = ["/", "/projects", "/blog"].map((p) => ({ path: p, date: null as string | null }));
  const urls = [...pages, ...(await listArticles())]
    .map((u) => `<url><loc>${siteUrl}${u.path}</loc>${u.date ? `<lastmod>${u.date}</lastmod>` : ""}</url>`)
    .join("\n");
  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
});
