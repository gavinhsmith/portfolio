<script setup>
defineProps(["href"]);
</script>

<template>
  <a :href="href" class="transition-colors text-white hover:text-accent-light">
    <span><slot /></span>
  </a>
</template>
