<script setup>
const { data: articles, error } = await useFetch("/api/blog");
if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: error.value.statusMessage,
    fatal: true,
  });
}

const { siteUrl } = useRuntimeConfig().public;
const description =
  "Gavin Smith's blog: Explanations and walk-throughs on my projects!";
useSeoMeta({
  title: "Blog | Gavin Smith",
  description,
  ogTitle: "Blog | Gavin Smith",
  ogDescription: description,
  ogType: "website",
  ogUrl: `${siteUrl}/blog`,
});
// ?q= and ?page= variants all point back at the plain /blog
useHead({ link: [{ rel: "canonical", href: `${siteUrl}/blog` }] });

// Search and page live in the URL (?q=…&page=…), so going back from an article keeps your place.
const PER_PAGE = 10;
const route = useRoute();
const router = useRouter();

// typing a search goes back to page 1
const q = computed({
  get: () => route.query.q ?? "",
  set: (v) => router.replace({ query: v ? { q: v } : {} }),
});

// every word has to appear in the title, description or tags
const filtered = computed(() => {
  const words = q.value.toLowerCase().split(/\s+/).filter(Boolean);
  return articles.value.filter((a) => {
    const text =
      `${a.title} ${a.description ?? ""} ${a.tags.join(" ")}`.toLowerCase();
    return words.every((w) => text.includes(w));
  });
});

const pageCount = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)),
);
const page = computed(() =>
  Math.min(Math.max(Number(route.query.page) || 1, 1), pageCount.value),
);
const shown = computed(() =>
  filtered.value.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE),
);
// Pager links set aria-current="false": vue-router ignores the query, so it marks them all "current".
const pageLink = (p) => ({
  query: { ...route.query, page: p === 1 ? undefined : p },
});
</script>

<template>
  <div class="w-full h-full overflow-y-auto px-4 pt-24 pb-8 md:pt-28">
    <div class="max-w-4xl mx-auto">
      <ComputerAppContainer title="~/blog" icon="tabler:notebook">
        <div class="bg-honeydew text-ink-black text-xs md:text-sm font-mono">
          <label
            class="flex items-center gap-2 px-4 py-2 border-b border-alabaster-grey"
          >
            <Icon name="tabler:search" class="shrink-0 text-prussian-blue" />
            <input
              v-model="q"
              type="search"
              placeholder="search titles, descriptions and tags"
              aria-label="Search articles"
              class="w-full bg-transparent outline-none placeholder:text-ink-black/40"
            />
          </label>
          <NuxtLink
            v-for="a in shown"
            :key="a.path"
            :to="a.path"
            class="grid grid-cols-[1fr_auto] gap-x-4 px-4 py-1.5 hover:bg-alabaster-grey/60"
          >
            <span class="flex items-center gap-2 min-w-0">
              <Icon
                name="tabler:file-text"
                class="shrink-0 text-prussian-blue"
              />
              <span class="truncate">{{ a.title }}</span>
              <span
                v-for="tag in a.tags"
                :key="tag"
                class="hidden sm:inline shrink-0 px-1.5 rounded bg-prussian-blue/10 text-prussian-blue text-xs"
              >
                {{ tag }}
              </span>
            </span>
            <time :datetime="a.date" class="opacity-70 whitespace-nowrap">{{
              fmtDate(`${a.date}T12:00`)
            }}</time>
            <!-- indented to line up with the title, past the icon -->
            <span
              v-if="a.description"
              class="col-span-2 pl-6 truncate text-xs opacity-60"
              >{{ a.description }}</span
            >
          </NuxtLink>
          <p v-if="!filtered.length" class="px-4 py-2 italic opacity-70">
            {{ q ? "No matches." : "Nothing here yet." }}
          </p>
          <nav
            v-if="pageCount > 1"
            aria-label="Pages"
            class="flex justify-center items-center gap-1 px-4 py-2 border-t border-alabaster-grey"
          >
            <template
              v-for="[label, p, name] in [
                ['<<', 1, 'First page'],
                ['<', page - 1, 'Previous page'],
              ]"
              :key="name"
            >
              <NuxtLink
                v-if="page > 1"
                :to="pageLink(p)"
                aria-current="false"
                :aria-label="name"
                class="px-1.5 hover:underline"
                >{{ label }}</NuxtLink
              >
              <span v-else class="px-1.5 opacity-30" aria-hidden="true">{{
                label
              }}</span>
            </template>
            <template v-for="(p, i) in pageList(page, pageCount)" :key="i">
              <span v-if="p === '…'" class="px-1.5 opacity-50">…</span>
              <span
                v-else-if="p === page"
                aria-current="page"
                class="px-1.5 rounded bg-prussian-blue text-honeydew font-bold"
                >{{ p }}</span
              >
              <NuxtLink
                v-else
                :to="pageLink(p)"
                aria-current="false"
                class="px-1.5 hover:underline"
                >{{ p }}</NuxtLink
              >
            </template>
            <template
              v-for="[label, p, name] in [
                ['>', page + 1, 'Next page'],
                ['>>', pageCount, 'Last page'],
              ]"
              :key="name"
            >
              <NuxtLink
                v-if="page < pageCount"
                :to="pageLink(p)"
                aria-current="false"
                :aria-label="name"
                class="px-1.5 hover:underline"
                >{{ label }}</NuxtLink
              >
              <span v-else class="px-1.5 opacity-30" aria-hidden="true">{{
                label
              }}</span>
            </template>
          </nav>
        </div>
      </ComputerAppContainer>
    </div>
  </div>
</template>
