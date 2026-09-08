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
      class="w-full h-dvh flex flex-col gap-2 items-center justify-center overflow-hidden"
    >
      <div class="mr-4">
        <div class="w-64">
          <ComputerAppContainer title="Now Playing" icon="tabler:file-music">
            <div
              class="p-4 gap-4 w-full h-full flex flex-row items-center justify-between bg-ink-black text-porcelain font-mono"
            >
              <img
                class="h-20 rounded-xs"
                src="https://i.scdn.co/image/ab67616d0000b2735d4f134be168c323db1faf80"
                alt="Now Playing Album Art"
              />
              <div class="w-full h-full flex flex-col gap-4 justify-between">
                <div class="w-full h-full flex flex-col">
                  <h2 class="text-xs">Close your Eyes</h2>
                  <h3 class="text-xs italic">The Midnight Club</h3>
                </div>
                <div
                  class="w-full h-full flex flex-row items-center justify-center gap-4 text-2xl"
                >
                  <Icon name="tabler:player-track-prev-filled" />
                  <Icon name="tabler:player-pause-filled" />
                  <Icon name="tabler:player-track-next-filled" />
                </div>
              </div>
            </div>
          </ComputerAppContainer>
        </div>
      </div>

      <div class="w-72">
        <ComputerAppContainer title="Welcome" icon="tabler:home-2">
          <div class="px-5 py-3 bg-honeydew text-ink-black">
            <h1 class="text-2xl text-prussian-blue font-serif font-bold italic">
              Howdy!
            </h1>
            <div class="w-10 h-0.5 mb-3 -mt-1 flex flex-row">
              <div class="bg-golden-glow w-full h-full" />
              <div class="bg-harvest-orange w-full h-full" />
              <div class="bg-oxblood w-full h-full" />
            </div>
            <p class="text-sm">
              My name is
              <strong class="text-prussian-blue">Gavin Smith</strong>, and I am
              a Computer Science student at the University of Wisconsin-Madison.
            </p>
            <p></p>
          </div>
        </ComputerAppContainer>
      </div>

      <div class="ml-4">
        <div class="w-64">
          <ComputerAppContainer title="Socials" icon="tabler:social">
            <div
              class="w-full h-full flex flex-col justify-center p-4 gap-2 bg-ink-black text-porcelain text-md font-mono"
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
  </div>
</template>
