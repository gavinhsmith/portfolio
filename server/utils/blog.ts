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

// Title is the article's first "# heading", falling back to the slug.
const titleOf = (md: string, slug: string) =>
  md.match(/^# (.+)$/m)?.[1].trim() ?? slug;

export const listArticles = async () => {
  const keys = (await store().getKeys("blog")).filter((k) => KEY.test(k));
  const articles = await Promise.all(
    keys.map(async (key) => {
      const [, y, m, d, slug] = key.match(KEY)!;
      const md = String(await store().getItem(key));
      return { path: `/blog/${y}/${m}/${d}/${slug}`, date: `${y}-${m}-${d}`, slug, title: titleOf(md, slug) };
    }),
  );
  return articles.sort((a, b) => b.date.localeCompare(a.date));
};

export const getArticle = async (y: string, m: string, d: string, slug: string) => {
  const key = `blog:${y}:${m}:${d}:${slug}.md`;
  if (!KEY.test(key)) return null;
  const md = await store().getItem(key);
  if (md == null) return null;
  return { date: `${y}-${m}-${d}`, slug, title: titleOf(String(md), slug), html: await marked.parse(String(md)) };
};
