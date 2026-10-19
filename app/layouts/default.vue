<template>
  <div class="flow-root w-screen h-dvh text-porcelain overscroll-none">
    <div class="w-full h-full absolute overflow-hidden -z-10">
      <FilterDisplacement :baseFreq="0.01" :dispScale="35">
        <div
          class="w-full h-full bg-deep-twilight bg-[url(/img/pattern.svg)] [background-size:calc(64px/var(--bg-scale,1))] bg-center scale-120 animate-[bg-pattern-drift_60s_linear_infinite]"
        ></div>
      </FilterDisplacement>
    </div>

    <NavBar />

    <!-- content fades out under the nav bar (nav is ~3.75rem tall, md: ~5.25rem) so it stays readable.
         The mask goes on the page element itself (*:), not this wrapper: Safari doesn't paint
         page transitions inside a masked parent. -->
    <div
      class="w-full h-full [--nav-fade:linear-gradient(to_bottom,transparent_3.75rem,black_6rem)] md:[--nav-fade:linear-gradient(to_bottom,transparent_5.25rem,black_7rem)] *:[-webkit-mask-image:var(--nav-fade)] *:[mask-image:var(--nav-fade)]"
    >
      <slot />
    </div>
  </div>
</template>
