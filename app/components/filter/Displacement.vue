<script setup>
defineProps(["baseFreq", "dispScale"]);
</script>

<template>
  <svg class="w-0 h-0 absolute">
    <filter id="distort-filter">
      <feTurbulence
        type="turbulence"
        :baseFrequency="0.01"
        numOctaves="3"
        result="turbulence"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="turbulence"
        :scale="35"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>

  <div class="w-full h-full filter-[url(#distort-filter)]">
    <slot />
  </div>
</template>
