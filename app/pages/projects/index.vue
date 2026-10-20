<script setup>
const PINNED = ["evoker", "tinclib", "titrmlib", "workshop64"];

const { data: repos, error } = await useFetch("/api/github");
if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: error.value.statusMessage,
    fatal: true,
  });
}

// File list shows only repos pushed in the last ~6 months until "see more" is opened.
const SIX_MONTHS = 1000 * 60 * 60 * 24 * 183;
const isRecent = (repo) => Date.now() - new Date(repo.pushed_at) < SIX_MONTHS;
const olderCount = computed(
  () => repos.value.filter((r) => !isRecent(r)).length,
);
const showAll = ref(false);

const pinned = computed(() =>
  PINNED.map((name) => repos.value.find((r) => r.name === name)).filter(
    Boolean,
  ),
);
</script>

<template>
  <div class="w-full h-full overflow-y-auto px-4 pt-24 pb-8 md:pt-28">
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink
          v-for="repo in pinned"
          :key="repo.name"
          :to="`/projects/${repo.name}`"
          class="group"
        >
          <ComputerAppContainer :title="repo.name" icon="tabler:pin">
            <div
              class="h-28 p-4 flex flex-col gap-2 bg-ink-black text-porcelain text-xs font-mono"
            >
              <p class="opacity-80 line-clamp-3">
                {{ repo.description ?? "No description." }}
              </p>
              <div class="mt-auto flex items-center gap-4">
                <span v-if="repo.language" class="flex items-center gap-1.5">
                  <Icon name="tabler:code" /> {{ repo.language }}
                </span>
                <span class="flex items-center gap-1.5">
                  <Icon name="tabler:star" /> {{ repo.stargazers_count }}
                </span>
                <span class="ml-auto group-hover:underline">open →</span>
              </div>
            </div>
          </ComputerAppContainer>
        </NuxtLink>
      </div>

      <ComputerAppContainer title="~/projects" icon="tabler:folders">
        <div class="bg-honeydew text-ink-black text-xs md:text-sm font-mono">
          <div
            class="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_8rem_7rem] gap-4 px-4 py-2 border-b border-alabaster-grey font-bold"
          >
            <span>Name</span>
            <span class="hidden md:block">Language</span>
            <span>Updated</span>
          </div>
          <NuxtLink
            v-for="repo in repos"
            v-show="showAll || isRecent(repo)"
            :key="repo.name"
            :to="`/projects/${repo.name}`"
            class="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_8rem_7rem] gap-4 px-4 py-1.5 hover:bg-alabaster-grey/60"
          >
            <span class="flex items-center gap-2 min-w-0">
              <Icon
                :name="repo.fork ? 'tabler:git-fork' : 'tabler:folder'"
                class="shrink-0 text-prussian-blue"
              />
              <span class="truncate">{{ repo.name }}/</span>
              <span v-if="repo.archived" class="opacity-60 italic"
                >archived</span
              >
            </span>
            <span class="hidden md:block opacity-70">{{
              repo.language ?? "—"
            }}</span>
            <span class="opacity-70 whitespace-nowrap">{{
              fmtDate(repo.pushed_at)
            }}</span>
          </NuxtLink>
          <button
            v-if="olderCount"
            type="button"
            :aria-expanded="showAll"
            class="w-full px-4 py-2 border-t border-alabaster-grey flex items-center gap-2 opacity-70 hover:opacity-100 hover:underline cursor-pointer"
            @click="showAll = !showAll"
          >
            <Icon
              :name="showAll ? 'tabler:chevron-up' : 'tabler:chevron-down'"
            />
            {{ showAll ? "see less" : `see more (${olderCount} older)` }}
          </button>
        </div>
      </ComputerAppContainer>
    </div>
  </div>
</template>
