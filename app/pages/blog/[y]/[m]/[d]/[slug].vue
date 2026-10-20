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
useHead({ title: `${article.value.title} | Gavin Smith` });
</script>

<template>
  <div class="w-full h-full overflow-y-auto px-4 pt-24 pb-8 md:pt-28">
    <div class="max-w-4xl mx-auto">
      <ComputerAppContainer :title="`${slug}.md`" icon="tabler:file-text">
        <article class="px-5 py-4 bg-honeydew">
          <p class="mb-2 text-xs font-mono text-ink-black/60">
            {{ fmtDate(`${article.date}T12:00`) }}
          </p>
          <div
            class="markdown prose prose-sm max-w-none prose-headings:text-prussian-blue prose-h1:font-serif prose-h1:italic prose-a:text-prussian-blue prose-pre:bg-ink-black"
            v-html="article.html"
          />
        </article>
      </ComputerAppContainer>
    </div>
  </div>
</template>
