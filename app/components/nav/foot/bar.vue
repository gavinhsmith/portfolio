<template>
  <div
    class="flex flex-row justify-between items-center h-12 w-full px-4 lg:px-8 text-xs lg:text-lg font-accent bg-light text-dark dark:bg-dark dark:text-light"
  >
    <div class="w-1/2 lg:w-1/3 flex flex-row justify-start items-center">
      <div class="flex flex-row justify-start items-center">
        <span>(c) 2025 -</span>
        <span class="ml-2 hidden lg:block">Gavin Smith</span>
        <span class="ml-2 block lg:hidden">GS</span>
      </div>
    </div>
    <div class="w-1/3 hidden lg:flex flex-row justify-center items-center">
      <span
        >Built with Love (and
        <a
          href="https://nuxt.com/"
          target="_blank"
          class="link hover:text-green-600"
          >Nuxt</a
        >)</span
      >
    </div>
    <div class="w-1/2 lg:w-1/3 flex flex-row justify-end items-center">
      <Typewriter
        :words="['I\'m not that creative...']"
        :loop="false"
        :wait="750"
      />
    </div>
  </div>
</template>
