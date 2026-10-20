<script setup>
const route = useRoute();

const { data, error } = await useFetch(`/api/github/${route.params.repo}`);
if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: error.value.statusMessage,
    fatal: true,
  });
}
const { project, readme, release, commits } = data.value;

// 14-day push strip for the git log window (same data as the home page's Activity).
// Not essential: if it fails to load, the strip is just left out.
const { data: activity } = await useFetch("/api/activity");
const pushes = computed(() => {
  if (!activity.value) return null;
  const mine = activity.value.repos.find(
    (r) => r.name.toLowerCase() === project.name.toLowerCase(),
  );
  const days = mine?.days ?? Array(activity.value.dates.length).fill(0);
  return { days, total: days.reduce((a, b) => a + b, 0) };
});

const updated = fmtDate(project.pushed_at);
</script>

<template>
  <div class="w-full h-full overflow-y-auto px-4 pt-24 pb-8 md:pt-28">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-start">
      <ComputerAppContainer
        title="README.md"
        icon="tabler:file-text"
        class="md:flex-1 min-w-0 order-3 md:order-none"
      >
        <div
          v-if="readme"
          class="markdown px-5 py-4 bg-honeydew prose prose-sm max-w-none prose-headings:text-prussian-blue prose-h1:font-serif prose-h1:italic prose-a:text-prussian-blue prose-pre:bg-ink-black"
          v-html="readme"
        />
        <p v-else class="px-5 py-4 bg-honeydew text-ink-black text-sm italic">
          No README yet.
        </p>
      </ComputerAppContainer>

      <!-- small screens: sidebar dissolves (contents) so its windows can be ordered
           around the README: name, release, README, git log -->
      <!-- desktop: sticks just below the nav fade (sticky offsets start inside the page's 7rem top
           padding; -top-3 cancels p-3); windows keep full height and the sidebar scrolls if taller
           than the screen. p-3/-m-3 leaves room for the window shadows inside the scroll box, and
           the 0.75rem edge fade sits in that padding, so it only shows on content scrolled past it. -->
      <div
        class="contents md:flex md:flex-col md:w-70 md:shrink-0 md:gap-4 md:sticky md:-top-3 md:max-h-[calc(100dvh-7.5rem)] md:overflow-y-auto md:p-3 md:-m-3 md:*:shrink-0 md:[--side-fade:linear-gradient(to_bottom,transparent,black_0.75rem,black_calc(100%_-_0.75rem),transparent)] md:[-webkit-mask-image:var(--side-fade)] md:[mask-image:var(--side-fade)]"
      >
        <ComputerAppContainer
          :title="project.name"
          icon="tabler:brand-github"
          class="order-1"
        >
          <div
            class="p-4 flex flex-col gap-2 bg-ink-black text-porcelain text-xs font-mono"
          >
            <p v-if="project.description" class="opacity-80">
              {{ project.description }}
            </p>
            <span v-if="project.language" class="flex items-center gap-2">
              <Icon name="tabler:code" /> {{ project.language }}
            </span>
            <span class="flex items-center gap-2">
              <Icon name="tabler:star" /> {{ project.stargazers_count }} stars
            </span>
            <span class="flex items-center gap-2">
              <Icon name="tabler:git-fork" /> {{ project.forks_count }} forks
            </span>
            <span class="flex items-center gap-2">
              <Icon name="tabler:clock" /> Updated {{ updated }}
            </span>
            <div
              v-if="project.topics?.length"
              class="flex flex-wrap gap-1 mt-1"
            >
              <span
                v-for="topic in project.topics"
                :key="topic"
                class="px-1.5 py-0.5 rounded bg-deep-twilight"
              >
                {{ topic }}
              </span>
            </div>
            <a
              :href="project.html_url"
              target="_blank"
              class="flex items-center gap-2 mt-1 hover:underline"
            >
              <Icon name="tabler:external-link" /> View on GitHub
            </a>
          </div>
        </ComputerAppContainer>

        <ComputerAppContainer
          v-if="release"
          title="Latest release"
          icon="tabler:tag"
          class="order-2"
        >
          <div
            class="p-4 flex flex-col gap-2 bg-ink-black text-porcelain text-xs font-mono"
          >
            <div class="flex items-baseline gap-2">
              <span class="px-1 rounded bg-deep-twilight text-golden-glow">{{
                release.tag_name
              }}</span>
              <span class="ml-auto opacity-60 whitespace-nowrap">{{
                fmtDate(release.published_at)
              }}</span>
            </div>
            <span v-if="release.name" class="font-bold">{{
              release.name
            }}</span>
            <a
              :href="release.html_url"
              target="_blank"
              class="flex items-center gap-2 mt-1 hover:underline"
            >
              <Icon name="tabler:external-link" /> View release
            </a>
          </div>
        </ComputerAppContainer>

        <ComputerAppContainer
          v-if="commits.length"
          title="git log"
          icon="tabler:git-branch"
          class="order-4"
        >
          <div
            v-if="pushes"
            class="px-4 pt-3 bg-ink-black text-porcelain text-xs font-mono"
          >
            <p class="opacity-70 mb-2">
              {{ pushes.total }} push{{ pushes.total === 1 ? "" : "es" }} in the
              last two weeks
            </p>
            <ActivityStrip :days="pushes.days" :dates="activity.dates" />
            <div
              class="flex justify-between mt-1 opacity-50 text-[10px]"
              aria-hidden="true"
            >
              <span>{{ activity.dates[0] }}</span>
              <span>today</span>
            </div>
          </div>
          <ol class="px-4 py-3 bg-ink-black text-porcelain text-xs font-mono">
            <li
              v-for="(c, i) in commits"
              :key="c.sha"
              class="relative pl-7 py-1.5"
            >
              <!-- graph: lane line + commit dot (ring for merge commits) -->
              <!-- line stops 7px short of each dot's center, leaving a gap around it -->
              <span
                v-if="i > 0"
                class="absolute left-[7px] top-0 bottom-[calc(50%+7px)] w-0.5 bg-golden-glow"
              />
              <span
                class="absolute left-[7px] top-[calc(50%+7px)] bottom-0 w-0.5 bg-golden-glow"
              />
              <span
                class="absolute left-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-golden-glow"
                :class="
                  c.parents.length > 1 ? 'bg-ink-black' : 'bg-golden-glow'
                "
              />
              <a
                :href="c.html_url"
                target="_blank"
                class="block hover:underline"
              >
                <span class="flex items-baseline gap-2">
                  <span class="text-harvest-orange">{{
                    c.sha.slice(0, 7)
                  }}</span>
                  <span
                    v-if="i === 0"
                    class="px-1 rounded bg-deep-twilight text-golden-glow"
                    >{{ project.default_branch }}</span
                  >
                  <span class="ml-auto opacity-60 whitespace-nowrap">{{
                    fmtDate(c.commit.author.date)
                  }}</span>
                </span>
                <span class="block truncate">{{
                  c.commit.message.split("\n")[0]
                }}</span>
              </a>
            </li>
          </ol>
        </ComputerAppContainer>
      </div>
    </div>
  </div>
</template>
