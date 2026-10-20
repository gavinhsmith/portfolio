<script setup>
import "highlight.js/styles/github-dark.css";

const { y, m, d, slug } = useRoute().params;

const { data: article, error } = await useFetch(`/api/blog/${y}/${m}/${d}/${slug}`);
if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: error.value.statusMessage,
    fatal: true,
  });
}
const { siteUrl } = useRuntimeConfig().public;
const url = `${siteUrl}/blog/${y}/${m}/${d}/${slug}`;
const { title, description, date, tags } = article.value;

useSeoMeta({
  title: `${title} | Gavin Smith`,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: "article",
  ogUrl: url,
  ogSiteName: "Gavin Smith",
  articlePublishedTime: date,
  articleAuthor: [siteUrl],
  articleTag: tags,
  twitterCard: "summary",
});
useHead({
  link: [{ rel: "canonical", href: url }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        datePublished: date,
        keywords: tags,
        url,
        mainEntityOfPage: url,
        author: { "@type": "Person", name: "Gavin Smith", url: siteUrl },
      }),
    },
  ],
});
</script>

<template>
  <div class="w-full h-full overflow-y-auto px-4 pt-24 pb-8 md:pt-28">
    <div class="max-w-4xl mx-auto">
      <ComputerAppContainer :title="`${slug}.md`" icon="tabler:file-text">
        <article class="px-5 py-4 bg-honeydew">
          <div
            class="mb-2 flex flex-wrap items-center gap-2 text-xs font-mono text-ink-black/60"
          >
            <time :datetime="article.date">{{ fmtDate(`${article.date}T12:00`) }}</time>
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="px-1.5 rounded bg-prussian-blue/10 text-prussian-blue"
            >
              {{ tag }}
            </span>
            <span
              v-if="article.related.length"
              class="ml-auto flex flex-wrap items-center gap-x-3"
            >
              <NuxtLink
                v-for="to in article.related"
                :key="to"
                :to="to"
                class="flex items-center gap-1 text-prussian-blue hover:underline"
              >
                <Icon name="tabler:folder" />
                {{ to.replace("/projects/", "") }} →
              </NuxtLink>
            </span>
          </div>
          <div
            class="markdown prose prose-sm max-w-none prose-headings:text-prussian-blue prose-h1:font-serif prose-h1:italic prose-a:text-prussian-blue prose-pre:bg-ink-black [&>h1:first-child]:pb-3 [&>h1:first-child]:border-b [&>h1:first-child]:border-alabaster-grey"
            v-html="article.html"
          />
        </article>
      </ComputerAppContainer>
    </div>
  </div>
</template>
