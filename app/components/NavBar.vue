<script setup>
const links = [
  { to: "/", label: "/index.md", exact: true },
  { to: "/projects", label: "/projects.md" },
];
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
      :active-class="link.exact ? '' : 'font-bold'"
      :exact-active-class="'font-bold'"
      class="inline-flex flex-col after:content-[attr(data-label)] after:font-bold after:h-0 after:overflow-hidden after:invisible after:select-none"
    >
      <!-- the hidden bold ::after copy reserves the bold width, so bolding never shifts the layout -->
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>
