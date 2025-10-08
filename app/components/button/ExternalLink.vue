<script type="ts" setup>
defineProps({
  href: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false
  }
})
</script>

<template>
  <a
    :href="href"
    target="_blank"
    class="w-full flex flex-row justify-center items-center gap-5 py-3 px-5 text-2xl md:text-3xl lg:text-4xl transition-colors bg-light text-dark hover:bg-accent-light hover:text-light dark:bg-dark dark:text-light shadow-sm hover:shadow-2xl"
  >
    <Icon v-if="icon" :name="icon" />
    <span>
      <slot />
    </span>
  </a>
</template>
