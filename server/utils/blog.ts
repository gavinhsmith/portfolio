import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js/lib/common";

// Code blocks get highlight.js classes (theme: github-dark, imported on the article page).
// ponytail: "common" set (~35 languages) keeps the Worker small; register others here if a post needs one.
const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight: (code, lang) =>
      hljs.highlight(code, { language: hljs.getLanguage(lang) ? lang : "plaintext" }).value,
  }),
);

// Articles: server/assets/blog/<yyyy>/<mm>/<dd>/<slug>.md, bundled into the Worker by Nitro.
// Storage keys use ":" for "/", e.g. "blog:2026:10:20:hello-world.md".
const KEY = /^blog:(\d{4}):(\d{2}):(\d{2}):([a-z0-9-]+)\.md$/;

const store = () => useStorage("assets:server");

// Optional frontmatter block at the top of an article, one "key: value" per line (all optional):
//   ---
//   title: Hello, world             (default: the first "# heading", then the slug)
//   description: One-line summary
//   date: 2026-10-20                (default: the folder date; the URL always uses the folder)
//   tags: [nuxt, cloudflare]
//   related: [evoker, tinclib]      (repo names: link to /projects/<repo>)
//   ---
// \r? because files may be checked out with CRLF on Windows.
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const REPO = /^[a-z0-9._-]{1,100}$/i; // GitHub repo names, as in server/api/github/[repo].get.ts

// ponytail: line-based "key: value", not real YAML; swap in a YAML parser if frontmatter needs nesting.
const unquote = (s: string) => s.replace(/^(["'])(.*)\1$/, "$2");

// "[a, b]" (or plain "a, b") -> ["a", "b"], deduped
const list = (s = "") => [
  ...new Set(
    s
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((t) => unquote(t.trim()))
      .filter(Boolean),
  ),
];

const parse = (raw: string, slug: string, folderDate: string) => {
  const fm = raw.match(FRONTMATTER);
  const meta: Record<string, string> = Object.fromEntries(
    (fm?.[1] ?? "")
      .split(/\r?\n/)
      .filter((line) => line.includes(":"))
      .map((line) => {
        const i = line.indexOf(":");
        return [line.slice(0, i).trim(), unquote(line.slice(i + 1).trim())];
      }),
  );
  let body = fm ? raw.slice(fm[0].length) : raw;

  // A frontmatter title is shown as the article's heading, so the body doesn't need its own.
  const title = meta.title || body.match(/^# (.+)$/m)?.[1].trim() || slug;
  if (meta.title) body = `# ${meta.title}\n\n${body}`;

  return {
    title,
    description: meta.description || null,
    date: DATE.test(meta.date ?? "") ? meta.date! : folderDate,
    // lowercased (then deduped again) so filtering by tag is a plain string match
    tags: [...new Set(list(meta.tags).map((t) => t.toLowerCase()))],
    related: list(meta.related)
      .map((r) => r.replace(/^\/?projects\//, ""))
      .filter((r) => REPO.test(r))
      .map((r) => `/projects/${r}`),
    body,
  };
};

export const listArticles = async () => {
  const keys = (await store().getKeys("blog")).filter((k) => KEY.test(k));
  const articles = await Promise.all(
    keys.map(async (key) => {
      const [, y, m, d, slug] = key.match(KEY)!;
      const { body, ...meta } = parse(String(await store().getItem(key)), slug, `${y}-${m}-${d}`);
      return { path: `/blog/${y}/${m}/${d}/${slug}`, slug, ...meta };
    }),
  );
  return articles.sort((a, b) => b.date.localeCompare(a.date));
};

export const getArticle = async (y: string, m: string, d: string, slug: string) => {
  const key = `blog:${y}:${m}:${d}:${slug}.md`;
  if (!KEY.test(key)) return null;
  const raw = await store().getItem(key);
  if (raw == null) return null;
  const { body, ...meta } = parse(String(raw), slug, `${y}-${m}-${d}`);
  return { slug, ...meta, html: await marked.parse(body) };
};
