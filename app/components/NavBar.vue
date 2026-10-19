<script setup>
defineProps(["path"]);
</script>

<template>
  <nav
    class="fixed top-0 left-0 z-10 w-full p-5 md:p-8 bg-transparent text-white font-mono text-sm flex flex-row items-center gap-2"
  >
    <img src="/favicon.svg" alt="" class="w-5 h-5 brightness-0 invert" />
    <span>{{ path }}</span>
  </nav>
</template>
