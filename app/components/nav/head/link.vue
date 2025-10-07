<script setup>
defineProps({
  href: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <a
    :href="$route.path === href ? '#' : href"
    class="text-dark dark:text-white hover:text-accent-light link"
  >
    <slot />
  </a>
</template>
