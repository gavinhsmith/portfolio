<script setup>
defineProps(["title", "icon"]);
</script>

<template>
  <div class="w-full h-full rounded-md flex flex-col overflow-hidden">
    <div
      class="w-full h-fit p-1 bg-porcelain text-ink-black font-sans flex flex-row justify-between"
    >
      <div class="flex flex-row items-center gap-1">
        <Icon v-if="icon" :name="icon" />
        <span class="mb-0.5 text-sm">{{ title }}</span>
      </div>
      <div class="mr-0.5 flex flex-row items-center gap-1">
        <span class="bg-green-500 w-2 h-2 rounded" />
        <span class="bg-yellow-500 w-2 h-2 rounded" />
        <span class="bg-red-500 w-2 h-2 rounded" />
      </div>
    </div>
    <div class="w-full h-full">
      <slot />
    </div>
  </div>
</template>
