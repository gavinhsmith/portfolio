import tailwindcss from "@tailwindcss/vite";
import { readdirSync } from "node:fs";

// Every article URL, read from server/assets/blog/<yyyy>/<mm>/<dd>/<slug>.md, so they get prerendered.
const articleRoutes = readdirSync("server/assets/blog", { recursive: true })
  .map((f) => String(f).replace(/\\/g, "/"))
  .filter((f) => f.endsWith(".md"))
  .map((f) => `/blog/${f.slice(0, -3)}`);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxt/icon"],
  css: ["~/assets/styles/main.css"],
  runtimeConfig: {
    // Optional; set NUXT_GITHUB_TOKEN to raise GitHub's rate limit (60/hr -> 5000/hr)
    githubToken: "",
    public: {
      // Used for canonical links, the sitemap and the RSS feed
      siteUrl: "https://gavinhsmith.com",
    },
  },
  routeRules: {
    // Static page: served as a plain asset, the Worker never runs for it
    "/": { prerender: true },
  },
  nitro: {
    preset: "cloudflare_module",
    // Articles are bundled at build time anyway, so serve them (and the sitemap/feed) as static files.
    // The /blog index stays server-rendered: its ?q= and ?page= change the HTML.
    prerender: {
      routes: ["/sitemap.xml", "/feed.xml", ...articleRoutes],
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: "portfolio",
        // GitHub API cache, shared by every Worker instance (see server/utils/github.ts)
        kv_namespaces: [{ binding: "CACHE", id: "10eec50f197b49f58022af91c3f0e5a1" }],
      },
    },
    // Nitro's cache (defineCachedFunction etc.) lives in KV in production...
    storage: {
      cache: { driver: "cloudflare-kv-binding", binding: "CACHE" },
    },
    // ...and in memory during `nuxt dev`
    devStorage: {
      cache: { driver: "memory" },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    baseURL: "/",
    head: {
      title: "Gavin Smith",
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "alternate", type: "application/rss+xml", title: "Gavin Smith's Blog", href: "/feed.xml" },
      ],
    },
  },
  icon: {
    mode: "css",
    cssLayer: "base",
  },
});
