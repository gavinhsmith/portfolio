<script setup>
const route = useRoute();

// On a project page, the project shows as a sub-item under /projects.md.
const items = computed(() => [
  { to: "/", label: "/index.md" },
  {
    to: "/projects",
    label: "/projects.md",
    child:
      route.name === "projects-repo" ? `/${route.params.repo}.md` : undefined,
  },
]);

// the hidden bold ::after copy reserves the bold width, so bolding never shifts the layout
const noShift =
  "inline-flex flex-col after:content-[attr(data-label)] after:font-bold after:h-0 after:overflow-hidden after:invisible after:select-none";
</script>

<template>
  <nav
    class="fixed top-0 left-0 z-10 w-full p-5 md:p-8 bg-transparent text-white font-mono text-sm flex flex-row items-center gap-4"
  >
    <img src="/favicon.svg" alt="" class="w-5 h-5 brightness-0 invert" />
    <span v-for="item in items" :key="item.to" class="relative">
      <NuxtLink
        :to="item.to"
        :data-label="item.label"
        :class="[noShift, { 'font-bold': route.path === item.to }]"
        class="hover:underline"
      >
        {{ item.label }}
      </NuxtLink>
      <!-- sub-item hangs below, out of flow, so the nav's height (and its fade) don't change -->
      <span
        v-if="item.child"
        class="absolute top-full left-0 pl-[1.071em] whitespace-nowrap font-bold"
        aria-current="page"
      >
        <!-- tree branch drawn as an L: starts right under the parent's "/", turns into the
             middle of this line (a └ glyph can't be lined up that precisely). The gap above it
             (to the parent's "/") and to its right (to this "/") are both 0.15em, measured
             against the glyphs: "/" ends 0.214em above the line bottom and overhangs its left edge by 0.071em. -->
        <span
          class="absolute left-[0.3em] -top-[0.064em] h-[calc(50%+0.064em)] w-[0.55em] border-l border-b border-white/50 rounded-bl-[3px]"
          aria-hidden="true"
        />
        {{ item.child }}
      </span>
    </span>
  </nav>
</template>
