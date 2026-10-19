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
  // Cache project pages + their API for 10 min (CDN/ISR on Vercel, in-server elsewhere)
  routeRules: {
    "/projects": { swr: 600 },
    "/projects/**": { swr: 600 },
    "/api/github": { swr: 600 },
    "/api/github/**": { swr: 600 },
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
