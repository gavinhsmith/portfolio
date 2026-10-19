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

    <div class="w-full h-full">
      <slot />
    </div>
  </div>
</template>
