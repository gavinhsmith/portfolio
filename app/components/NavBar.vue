<script setup>
const route = useRoute();
const NuxtLink = resolveComponent("NuxtLink");

// Each nav item is a list of parts; parts with `to` are links.
// On a project page, /projects.md becomes /projects/<name>.md, with the
// "/projects" part still linking back to /projects.
const items = computed(() => [
  { active: route.path === "/", parts: [{ label: "/index.md", to: "/" }] },
  route.name === "projects-repo"
    ? {
        active: true,
        parts: [
          { label: "/projects", to: "/projects" },
          { label: `/${route.params.repo}.md` },
        ],
      }
    : {
        active: route.path === "/projects",
        parts: [{ label: "/projects.md", to: "/projects" }],
      },
]);
</script>

<template>
  <nav
    class="fixed top-0 left-0 z-10 w-full p-5 md:p-8 bg-transparent text-white font-mono text-sm flex flex-row items-center gap-4"
  >
    <img src="/favicon.svg" alt="" class="w-5 h-5 brightness-0 invert" />
    <span
      v-for="item in items"
      :key="item.parts[0].label"
      :class="{ 'font-bold': item.active }"
    >
      <!-- the hidden bold ::after copy reserves the bold width, so bolding never shifts the layout -->
      <component
        :is="part.to ? NuxtLink : 'span'"
        v-for="part in item.parts"
        :key="part.label"
        :to="part.to"
        :data-label="part.label"
        :class="{ 'hover:underline': part.to }"
        class="inline-flex flex-col after:content-[attr(data-label)] after:font-bold after:h-0 after:overflow-hidden after:invisible after:select-none"
      >
        {{ part.label }}
      </component>
    </span>
  </nav>
</template>
