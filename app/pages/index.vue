<script setup>
// Home is prerendered, so activity loads in the browser (cached server-side for 1h).
const { data: activity } = useFetch("/api/activity", { server: false });

// Activity rows. Phone: name + last push on top, strip below. Desktop: one row.
const row = {
  grid: "grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[7rem_minmax(0,1fr)_5.5rem] items-center gap-x-3 gap-y-1",
  name: "col-start-1 row-start-1",
  strip: "col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1",
  last: "col-start-2 row-start-1 md:col-start-3 text-right whitespace-nowrap",
};

// The API returns every repo pushed to recently, most recent first; show the top 4.
const topRepos = computed(() => activity.value?.repos.slice(0, 4) ?? []);

// Articles ship with the build, so the latest one is fetched while prerendering and baked in.
const { data: articles } = await useFetch("/api/blog");
const latest = computed(() => articles.value?.[0]);
</script>

<template>
  <div class="h-full">
    <!-- The bowl tilts the windows inside it (desktop). Windows are its direct grid children
         (no transformed wrappers), so a grabbed window can rise above the others.
         Layout: phone, one column. md: two columns. lg+: three columns in two rows, so it fits
         a laptop screen without scrolling: Welcome | Currently | Latest post, then Activity | Socials.
         Windows use h-auto! so they keep their own height instead of stretching to the row. -->
    <ComputerAppBowl
      class="w-full h-full grid grid-cols-[minmax(0,20rem)] md:grid-cols-[24rem_18rem] lg:grid-cols-[22rem_16rem_16rem] xl:grid-cols-[24rem_18rem_18rem] justify-center-safe content-center-safe items-start gap-2 md:gap-4 overflow-x-hidden overflow-y-auto px-4 py-24 md:py-28"
    >
      <ComputerAppContainer
        title="Welcome"
        icon="tabler:home-2"
        movable
        class="md:-translate-y-4 md:row-span-2 lg:row-span-1 md:self-center h-auto!"
      >
        <div class="px-6 py-5 md:px-7 md:py-6 bg-honeydew text-ink-black">
          <h1
            class="text-3xl md:text-4xl text-prussian-blue font-serif font-bold italic"
          >
            Howdy!
          </h1>
          <div class="w-14 h-1 mb-4 -mt-0.5 flex flex-row">
            <div class="bg-golden-glow w-full h-full" />
            <div class="bg-harvest-orange w-full h-full" />
            <div class="bg-oxblood w-full h-full" />
          </div>
          <p class="text-sm md:text-base leading-relaxed">
            My name is
            <strong class="text-prussian-blue">Gavin Smith</strong>
            (he/him), a Computer Science student at the University of
            Wisconsin-Madison
            <span class="italic">(Class of 2028)</span>, pursuing a certificate
            in Physics.
          </p>
          <p class="text-sm md:text-base mt-2 flex items-center gap-1">
            <Icon name="tabler:map-pin" />
            Madison, WI
          </p>
        </div>
      </ComputerAppContainer>

      <ComputerAppContainer
        title="Currently"
        icon="tabler:bulb"
        movable
        class="md:translate-y-4 h-auto!"
      >
        <div
          class="w-full h-full flex flex-col justify-center px-4 py-2 md:px-4 gap-1 md:gap-2.5 bg-ink-black text-porcelain text-md font-mono"
        >
          <div class="flex flex-row items-center gap-3">
            <Icon name="tabler:manual-gearbox" class="shrink-0" />
            <div class="flex flex-col leading-tight">
              <span class="text-xs md:text-sm">Project Manager</span>
              <span class="text-[10px] md:text-xs italic opacity-70"
                >Software Development Club</span
              >
            </div>
          </div>
          <div class="flex flex-row items-center gap-3">
            <Icon name="tabler:code" class="shrink-0" />
            <div class="flex flex-col leading-tight">
              <span class="text-xs md:text-sm">Full-Stack Developer</span>
              <span class="text-[10px] md:text-xs italic opacity-70"
                >WebLabs, SDC</span
              >
            </div>
          </div>
          <div class="flex flex-row items-center gap-3">
            <Icon name="tabler:rocket" class="shrink-0" />
            <div class="flex flex-col leading-tight">
              <span class="text-xs md:text-sm">Building</span>
              <span class="text-[10px] md:text-xs italic opacity-70"
                >A lot of
                <NuxtLink to="/projects" class="underline hover:opacity-100"
                  >stuff</NuxtLink
                >!</span
              >
            </div>
          </div>
        </div>
      </ComputerAppContainer>

      <ComputerAppContainer
        title="Socials"
        icon="tabler:social"
        movable
        class="lg:col-start-3 lg:row-start-2 md:translate-x-3 md:translate-y-4 h-auto!"
      >
        <div
          class="w-full h-full flex flex-col justify-center p-4 gap-2 bg-ink-black text-porcelain text-xs md:text-md font-mono"
        >
          <a
            class="flex flex-row items-center gap-3 hover:underline"
            href="https://github.com/gavinhsmith"
            target="_blank"
          >
            <Icon name="tabler:brand-github" />
            <span>/ gavinhsmith</span></a
          >
          <a
            class="flex flex-row items-center gap-3 hover:underline"
            href="https://www.linkedin.com/in/gavinhsmith05"
            target="_blank"
          >
            <Icon name="tabler:brand-linkedin" />
            <span>/ gavinhsmith05 </span>
          </a>
          <a
            class="flex flex-row items-center gap-3 hover:underline"
            href="mailto:me@gavinhsmith.com"
            target="_blank"
          >
            <Icon name="tabler:mail" />
            <span>/ me@gavinhsmith.com</span>
          </a>
        </div>
      </ComputerAppContainer>

      <ComputerAppContainer
        v-if="latest"
        title="Latest post"
        icon="tabler:notebook"
        movable
        class="md:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 md:translate-x-2 lg:-translate-x-2 md:translate-y-3 lg:-translate-y-2 h-auto!"
      >
        <div
          class="w-full h-full flex flex-col gap-1 p-4 bg-ink-black text-porcelain text-xs font-mono"
        >
          <span class="opacity-60">{{ fmtDate(`${latest.date}T12:00`) }}</span>
          <NuxtLink
            :to="latest.path"
            class="text-sm font-bold hover:underline"
            >{{ latest.title }}</NuxtLink
          >
          <p v-if="latest.description" class="opacity-70 line-clamp-2">
            {{ latest.description }}
          </p>
          <div class="mt-auto pt-1 flex justify-between">
            <NuxtLink to="/blog" class="opacity-70 hover:underline"
              >all posts</NuxtLink
            >
            <NuxtLink :to="latest.path" class="hover:underline"
              >read →</NuxtLink
            >
          </div>
        </div>
      </ComputerAppContainer>

      <ComputerAppContainer
        title="Activity"
        icon="tabler:activity"
        movable
        class="md:col-span-2 lg:col-start-1 lg:row-start-2 md:translate-x-6 md:translate-y-2"
      >
        <div class="px-4 py-3 bg-ink-black text-porcelain text-xs font-mono">
          <p class="opacity-70 mb-2.5">
            Pushes to GitHub over the last two weeks
          </p>

          <!-- placeholder rows keep the window's size steady until data arrives -->
          <ul v-if="!activity" class="flex flex-col gap-2" aria-hidden="true">
            <li v-for="i in 3" :key="i" :class="row.grid">
              <span
                :class="row.name"
                class="h-3 w-20 rounded-sm bg-deep-twilight"
              />
              <ActivityStrip :class="row.strip" />
            </li>
          </ul>

          <p v-else-if="!topRepos.length" class="opacity-70">
            No public pushes in the last two weeks.
          </p>

          <ul v-else class="flex flex-col gap-2">
            <li v-for="repo in topRepos" :key="repo.name">
              <NuxtLink
                :to="`/projects/${repo.name}`"
                class="group"
                :class="row.grid"
              >
                <span
                  :class="row.name"
                  class="truncate group-hover:underline"
                  >{{ repo.name }}</span
                >
                <ActivityStrip
                  :class="row.strip"
                  :days="repo.days"
                  :dates="activity.dates"
                />
                <span :class="row.last" class="opacity-70">{{
                  repo.last
                }}</span>
              </NuxtLink>
            </li>
            <!-- axis: which end of the strip is which -->
            <li
              :class="row.grid"
              class="opacity-50 text-[10px]"
              aria-hidden="true"
            >
              <span :class="row.strip" class="flex justify-between">
                <span>{{ activity.dates[0] }}</span>
                <span>today</span>
              </span>
            </li>
          </ul>
        </div>
      </ComputerAppContainer>
    </ComputerAppBowl>
  </div>
</template>
