<script setup>
const route = useRoute();

// Mock data, shaped like GitHub's GET /repos/{owner}/{repo} response
// so it can be swapped for a real fetch later.
const project = {
  name: route.params.repo,
  description: "A placeholder project used to mock up the project page.",
  html_url: `https://github.com/gavinhsmith/${route.params.repo}`,
  language: "TypeScript",
  stargazers_count: 12,
  forks_count: 3,
  topics: ["nuxt", "vue", "tailwind"],
  updated_at: "2026-10-12T18:30:00Z",
};

// Mock README, as GitHub returns it rendered to HTML
// (GET /repos/{owner}/{repo}/readme with Accept: application/vnd.github.html).
const readme = `
<h1>${project.name}</h1>
<p>This is a mock README. The real one will be pulled from GitHub.</p>
<h2>Getting started</h2>
<pre><code>yarn install
yarn dev</code></pre>
<h2>Features</h2>
<ul>
  <li>Thing one</li>
  <li>Thing two</li>
</ul>
`;

// Mock commits (this portfolio repo's real history), shaped like GitHub's
// GET /repos/{owner}/{repo}/commits?sha=main&per_page=6 response.
const commits = [
  ["4083b6638cf3b2de344af12926005853b024f5d8", "2026-10-19T10:44:50-05:00", "[ui] Add second page"],
  ["56167a64662828b0095415a551c2ab57263e58d0", "2026-10-19T10:08:44-05:00", "[ui] Added basic nav bar"],
  ["8a563a3fbe88fd0cb87b8b5f4f553d33efa2c963", "2026-10-19T09:37:26-05:00", "[ui] Fixed scrolling bg"],
  ["d52754119cda44534b98653b228e801cafbbfb36", "2026-10-19T09:27:14-05:00", "[fix] Fix tinclib name"],
  ["47d0b4193e1e74c46f24d0cbf9e6c163bcaf5e3e", "2026-09-18T00:02:52-05:00", "[ui] Replaced favicon with something newer"],
  ["9d026285d3822105cbcbdd3360f93795976a67f9", "2026-09-17T17:10:45-05:00", "[ui] Switch icon on main page"],
].map(([sha, date, message], i, all) => ({
  sha,
  html_url: `${project.html_url}/commit/${sha}`,
  parents: all[i + 1] ? [{ sha: all[i + 1][0] }] : [],
  commit: { message, author: { name: "Gavin Smith", date } },
}));

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const updated = fmtDate(project.updated_at);

// Mock release, shaped like GitHub's GET /repos/{owner}/{repo}/releases/latest
// response (body_html comes back with Accept: application/vnd.github.html+json).
const release = {
  tag_name: "v1.2.0",
  name: "Nav bar & project pages",
  html_url: `${project.html_url}/releases/tag/v1.2.0`,
  published_at: "2026-10-19T11:00:00-05:00",
  body_html: `
<ul>
  <li>Added a floating nav bar</li>
  <li>Added project info pages</li>
  <li>Fixed the background animation loop</li>
</ul>
`,
};
</script>

<template>
  <div class="w-full h-full overflow-y-auto px-4 pt-20 pb-8 md:pt-24">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-start">
      <ComputerAppContainer
        title="README.md"
        icon="tabler:file-text"
        class="md:flex-1 min-w-0"
      >
        <div
          class="px-5 py-4 bg-honeydew text-ink-black text-sm [&_h1]:text-2xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:italic [&_h1]:text-prussian-blue [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-prussian-blue [&_h2]:mt-4 [&_h2]:mb-1 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_pre]:bg-ink-black [&_pre]:text-porcelain [&_pre]:font-mono [&_pre]:text-xs [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto [&_a]:underline"
          v-html="readme"
        />
      </ComputerAppContainer>

      <div class="w-full md:w-64 shrink-0 flex flex-col gap-4">
        <ComputerAppContainer :title="project.name" icon="tabler:brand-github">
          <div
            class="p-4 flex flex-col gap-2 bg-ink-black text-porcelain text-xs font-mono"
          >
            <p class="opacity-80">{{ project.description }}</p>
            <span class="flex items-center gap-2">
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
            <div class="flex flex-wrap gap-1 mt-1">
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

        <ComputerAppContainer title="Latest release" icon="tabler:tag">
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
            <span class="font-bold">{{ release.name }}</span>
            <div
              class="opacity-80 [&_ul]:list-disc [&_ul]:pl-4 [&_p]:mb-1 [&_a]:underline"
              v-html="release.body_html"
            />
            <a
              :href="release.html_url"
              target="_blank"
              class="flex items-center gap-2 mt-1 hover:underline"
            >
              <Icon name="tabler:external-link" /> View release
            </a>
          </div>
        </ComputerAppContainer>

        <ComputerAppContainer title="git log" icon="tabler:git-branch">
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
                :class="c.parents.length > 1 ? 'bg-ink-black' : 'bg-golden-glow'"
              />
              <a :href="c.html_url" target="_blank" class="block hover:underline">
                <span class="flex items-baseline gap-2">
                  <span class="text-harvest-orange">{{ c.sha.slice(0, 7) }}</span>
                  <span
                    v-if="i === 0"
                    class="px-1 rounded bg-deep-twilight text-golden-glow"
                    >main</span
                  >
                  <span class="ml-auto opacity-60 whitespace-nowrap">{{
                    fmtDate(c.commit.author.date)
                  }}</span>
                </span>
                <span class="block truncate">{{ c.commit.message }}</span>
              </a>
            </li>
          </ol>
        </ComputerAppContainer>
      </div>
    </div>
  </div>
</template>
