<script setup>
const props = defineProps(["baseFreq", "dispScale"]);

// On 3x screens (iPhones) Safari can't run this filter at full resolution fast
// enough: every repaint re-runs it, which starves page transitions of frames.
// So there we filter a 1/3-size layer and scale it back up. Children size their
// background with var(--bg-scale) to compensate. Set after mount so SSR markup matches.
const k = ref(1);
onMounted(() => {
  if (window.devicePixelRatio >= 2.5) k.value = 3;
});
</script>

<template>
  <svg class="w-0 h-0 absolute">
    <filter id="distort-filter">
      <feTurbulence
        type="turbulence"
        :baseFrequency="baseFreq * k"
        numOctaves="3"
        result="turbulence"
      >
        <animate
          attributeName="baseFrequency"
          :values="`${baseFreq * k};${baseFreq * k * 1.6};${baseFreq * k}`"
          dur="20s"
          repeatCount="indefinite"
        />
      </feTurbulence>
      <feDisplacementMap
        in="SourceGraphic"
        in2="turbulence"
        :scale="dispScale / k"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>

  <div
    class="filter-[url(#distort-filter)] origin-top-left"
    :style="{
      width: `${100 / k}%`,
      height: `${100 / k}%`,
      transform: k > 1 ? `scale(${k})` : undefined,
      '--bg-scale': k,
    }"
  >
    <slot />
  </div>
</template>
