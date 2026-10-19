import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxt/icon"],
  css: ["~/assets/styles/main.css"],
  runtimeConfig: {
    // Optional; set NUXT_GITHUB_TOKEN to raise GitHub's rate limit (60/hr -> 5000/hr)
    githubToken: "",
  },
  routeRules: {
    // Static page: served as a plain asset, the Worker never runs for it
    "/": { prerender: true },
  },
  nitro: {
    preset: "cloudflare_module",
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
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  icon: {
    mode: "css",
    cssLayer: "base",
  },
});
