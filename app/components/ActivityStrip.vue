<script setup>
// One cell per day (oldest first), colored by push count. No `days` = loading placeholder.
defineProps({ days: Array, dates: Array });

// Heat scale built from the title-bar dots: oxblood -> orange -> gold.
const heat = (n) =>
  n === 0
    ? "bg-deep-twilight"
    : n === 1
      ? "bg-oxblood"
      : n <= 3
        ? "bg-harvest-orange"
        : "bg-golden-glow";
</script>

<template>
  <span class="flex gap-0.5 md:gap-1">
    <template v-if="days">
      <span
        v-for="(n, d) in days"
        :key="d"
        :title="`${n} push${n === 1 ? '' : 'es'} on ${dates[d]}`"
        class="flex-1 h-3.5 rounded-[2px]"
        :class="heat(n)"
      />
    </template>
    <template v-else>
      <span
        v-for="d in 14"
        :key="d"
        class="flex-1 h-3.5 rounded-[2px] bg-deep-twilight/60"
        aria-hidden="true"
      />
    </template>
  </span>
</template>
