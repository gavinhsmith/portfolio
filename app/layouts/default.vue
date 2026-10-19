<template>
  <div class="flow-root w-screen h-dvh text-porcelain overscroll-none">
    <div class="w-full h-full absolute overflow-hidden -z-10">
      <FilterDisplacement :baseFreq="0.01" :dispScale="35">
        <div
          class="w-full h-full bg-deep-twilight bg-[url(/img/pattern.svg)] bg-center scale-120 animate-[bg-pattern-drift_60s_linear_infinite]"
        ></div>
      </FilterDisplacement>
    </div>

    <NavBar />

    <!-- content fades out under the nav bar (nav is ~3.75rem tall, md: ~5.25rem) so it stays readable -->
    <div
      class="w-full h-full [mask-image:linear-gradient(to_bottom,transparent_3.75rem,black_6rem)] md:[mask-image:linear-gradient(to_bottom,transparent_5.25rem,black_7rem)]"
    >
      <slot />
    </div>
  </div>
</template>
