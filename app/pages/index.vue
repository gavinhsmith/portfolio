<template>
  <div>
    <div class="w-full h-full absolute overflow-hidden">
      <FilterDisplacement :baseFreq="0.01" :dispScale="35">
        <div
          class="w-full h-full bg-deep-twilight bg-[url(/img/pattern.svg)] bg-center scale-120"
        ></div>
      </FilterDisplacement>
    </div>

    <div
      class="w-full h-dvh flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-center overflow-hidden px-4"
    >
      <div class="w-full max-w-72">
        <ComputerAppContainer title="Welcome" icon="tabler:home-2">
          <div class="px-5 py-3 bg-honeydew text-ink-black">
            <h1
              class="text-xl md:text-2xl text-prussian-blue font-serif font-bold italic"
            >
              Howdy!
            </h1>
            <div class="w-10 h-0.5 mb-3 -mt-1 flex flex-row">
              <div class="bg-golden-glow w-full h-full" />
              <div class="bg-harvest-orange w-full h-full" />
              <div class="bg-oxblood w-full h-full" />
            </div>
            <p class="text-xs md:text-sm">
              My name is
              <strong class="text-prussian-blue">Gavin Smith</strong>
              (he/him), a Computer Science student at the University of
              Wisconsin-Madison
              <span class="italic">(Class of 2028)</span>, pursuing a
              certificate in Physics.
            </p>
            <p class="text-xs md:text-sm mt-1 flex items-center gap-1">
              <Icon name="tabler:map-pin" />
              Madison, WI
            </p>
          </div>
        </ComputerAppContainer>
      </div>

      <div class="w-full max-w-72 flex flex-col gap-2">
        <ComputerAppContainer title="Currently" icon="tabler:bulb">
          <div
            class="w-full h-full flex flex-col justify-center p-4 gap-2.5 bg-ink-black text-porcelain text-md font-mono"
          >
            <div class="flex flex-row items-center gap-3">
              <Icon name="tabler:cash" class="shrink-0" />
              <div class="flex flex-col leading-tight">
                <span class="text-xs md:text-sm">VP of Finance</span>
                <span class="text-[10px] md:text-xs italic opacity-70"
                  >Software Development Club</span
                >
              </div>
            </div>
            <div class="flex flex-row items-center gap-3">
              <Icon name="tabler:code" class="shrink-0" />
              <div class="flex flex-col leading-tight">
                <span class="text-xs md:text-sm">Developer</span>
                <span class="text-[10px] md:text-xs italic opacity-70"
                  >WebLabs, UW-Madison</span
                >
              </div>
            </div>
            <div class="flex flex-row items-center gap-3">
              <Icon name="tabler:rocket" class="shrink-0" />
              <div class="flex flex-col leading-tight">
                <span class="text-xs md:text-sm">Building</span>
                <span class="text-[10px] md:text-xs italic opacity-70"
                  >Open Game Host & Pulse</span
                >
              </div>
            </div>
          </div>
        </ComputerAppContainer>

        <ComputerAppContainer title="Socials" icon="tabler:social">
          <div
            class="w-full h-full flex flex-col justify-center p-4 gap-2 bg-ink-black text-porcelain text-xs md:text-md font-mono"
          >
            <a
              class="flex flex-row items-center gap-3 hover:underline"
              href="https://github.com/gavinhsmith"
              target="_blank"
            >
              <Icon name="tabler:brand-github" />
              <span>/ gavinhsmith</span></a
            >
            <a
              class="flex flex-row items-center gap-3 hover:underline"
              href="https://www.linkedin.com/in/gavinhsmith05"
              target="_blank"
            >
              <Icon name="tabler:brand-linkedin" />
              <span>/ gavinhsmith05 </span>
            </a>
            <a
              class="flex flex-row items-center gap-3 hover:underline"
              href="mailto:me@gavinhsmith.com"
              target="_blank"
            >
              <Icon name="tabler:mail" />
              <span>/ me@gavinhsmith.com</span>
            </a>
          </div>
        </ComputerAppContainer>
      </div>
    </div>
  </div>
</template>
