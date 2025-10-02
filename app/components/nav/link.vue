<script setup>
defineProps(["href"]);
</script>

<template>
  <a
    :href="href"
    class="transition-colors pb-0.5 text-white hover:text-accent-light"
  >
    <span><slot /></span>
  </a>
</template>
