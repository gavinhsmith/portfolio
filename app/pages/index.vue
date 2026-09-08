<template>
  <div>
    <div
      class="w-full h-screen absolute bg-deep-twilight bg-[url(/img/pattern.svg)] overflow-hidden"
    >
      <FilterDisplacement :baseFreq="0.01" :dispScale="35">
      </FilterDisplacement>
    </div>
    <div class="w-full h-screen flex flex-col items-center justify-center">
      <div class="w-88 lg:w-lg lg:mr-72">
        <ComputerAppContainer title="Welcome" icon="tabler:alert-hexagon">
          <div class="pl-10 pr-20 py-6 bg-honeydew text-ink-black">
            <h1 class="text-4xl lg:text-5xl text-light-cyan font-serif italic">
              Howdy!
            </h1>
            <div class="w-12 h-0.75 mb-6 mt-2 lg:mb-12 flex flex-row">
              <div class="bg-golden-glow w-full h-full" />
              <div class="bg-harvest-orange w-full h-full" />
              <div class="bg-oxblood w-full h-full" />
            </div>
            <p class="text-lg">
              My name is Gavin Smith, and I am a Computer Science student at the
              University of Wisconsin-Madison.
            </p>
          </div>
        </ComputerAppContainer>
      </div>
    </div>
  </div>
</template>
