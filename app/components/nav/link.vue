<script setup>
defineProps(["href"]);
</script>

<template>
  <a
    :href="$route.path === href ? '#' : href"
    class="transition-all text-dark dark:text-white hover:text-accent-light no-underline bg-gradient-to-t from-0% to-0% hover:from-accent-light hover:to-15%"
  >
    <slot />
  </a>
</template>
