<script setup>
const route = useRoute();

const links = [
  { to: "/", label: "/index.md", exact: true },
  { to: "/projects", label: "/projects.md" },
];

// /projects and /projects/[repo] are separate routes, so NuxtLink's
// active-class can't see the nesting; match on the path instead.
const isActive = (link) =>
  link.exact
    ? route.path === link.to
    : route.path === link.to || route.path.startsWith(link.to + "/");
</script>

<template>
  <nav
    class="fixed top-0 left-0 z-10 w-full p-5 md:p-8 bg-transparent text-white font-mono text-sm flex flex-row items-center gap-4"
  >
    <img src="/favicon.svg" alt="" class="w-5 h-5 brightness-0 invert" />
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      :data-label="link.label"
      :class="{ 'font-bold': isActive(link) }"
      class="inline-flex flex-col after:content-[attr(data-label)] after:font-bold after:h-0 after:overflow-hidden after:invisible after:select-none"
    >
      <!-- the hidden bold ::after copy reserves the bold width, so bolding never shifts the layout -->
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>
