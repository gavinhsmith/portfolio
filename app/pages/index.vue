<template>
  <div>
    <div
      class="w-full h-screen absolute bg-deep-twilight bg-[url(/img/pattern.svg)] overflow-hidden"
    >
      <FilterDisplacement :baseFreq="0.01" :dispScale="35">
      </FilterDisplacement>
    </div>
    <div class="w-full h-screen flex flex-col items-center justify-center">
      <div class="w-80 h-64 lg:h-80 absolute mt-136 lg:mt-96 ml-32 lg:ml-164">
        <ComputerAppContainer title="Playing Now" icon="tabler:file-music">
          <div
            class="w-full h-full flex flex-col items-center justify-center bg-ink-black text-porcelain text-3xl font-mono"
          >
            W.I.P. :P
          </div>
        </ComputerAppContainer>
      </div>

      <div class="w-80 lg:w-lg h-64 absolute mb-136 lg:mb-96 mr-32 lg:ml-98">
        <ComputerAppContainer title="Socials" icon="tabler:social">
          <div
            class="w-full h-full flex flex-col items-center justify-center bg-ink-black text-porcelain text-3xl font-mono"
          >
            W.I.P. :P
          </div>
        </ComputerAppContainer>
      </div>

      <div class="w-88 lg:w-xl lg:mr-88 absolute">
        <ComputerAppContainer title="Welcome" icon="tabler:home-2">
          <div class="pl-10 pr-20 py-6 bg-honeydew text-ink-black">
            <h1
              class="text-4xl lg:text-5xl text-prussian-blue font-serif font-bold italic"
            >
              Howdy!
            </h1>
            <div class="w-12 h-0.75 mb-6 mt-2 lg:mb-12 flex flex-row">
              <div class="bg-golden-glow w-full h-full" />
              <div class="bg-harvest-orange w-full h-full" />
              <div class="bg-oxblood w-full h-full" />
            </div>
            <p class="lg:text-lg">
              My name is
              <strong class="text-prussian-blue">Gavin Smith</strong>, and I am
              a Computer Science student at the University of Wisconsin-Madison.
            </p>
            <p></p>
          </div>
        </ComputerAppContainer>
      </div>
    </div>
  </div>
</template>
